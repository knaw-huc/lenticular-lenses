from psycopg2 import sql as psycopg2_sql

from ll.data.joins import Joins
from ll.data.collection import Collection
from ll.data.property_field import PropertyField

from ll.job.filter_function import FilterFunction


class EntityTypeSelection:
    def __init__(self, data, job):
        self._data = data
        self._job = job

        graphql = data['dataset']['timbuctoo_graphql']
        hsid = data['dataset']['timbuctoo_hsid'] if not data['dataset']['published'] else None
        dataset_id = self._data['dataset']['dataset_id']
        collection_id = self._data['dataset']['collection_id']

        collection = Collection(graphql, hsid, dataset_id, collection_id)
        self.table_name = collection.table_name
        self.columns = collection.columns
        self.view_queued = collection.rows_downloaded > -1 \
                           and (self.limit < 0 or self.limit > collection.rows_downloaded)

    @property
    def id(self):
        return self._data.get('id')

    @property
    def internal_id(self):
        return self._data['internal_id']

    @property
    def dataset_id(self):
        return self._data['dataset']['dataset_id']

    @property
    def collection_id(self):
        return self._data['dataset']['collection_id']

    @property
    def limit(self):
        return self._data.get('limit', -1)

    @property
    def properties(self):
        return self._data['properties']

    @property
    def related(self):
        return self._data['related'] if 'related' in self._data else []

    @property
    def filters(self):
        return self._r_get_filters(self._data['filter']) if 'filter' in self._data and self._data['filter'] else []

    @property
    def filter_sql(self):
        return self._r_get_filter_sql(self._data['filter']) \
            if 'filter' in self._data and self._data['filter'] else psycopg2_sql.SQL('')

    @property
    def where_sql(self):
        where_sql = self.filter_sql
        if where_sql != psycopg2_sql.SQL(''):
            where_sql = psycopg2_sql.SQL('WHERE {}').format(where_sql)

        return where_sql

    @property
    def limit_sql(self):
        random = '\nORDER BY RANDOM()' if self._data.get('random', False) else ''
        return psycopg2_sql.SQL(') AS x%s\nLIMIT %i' % (random, self.limit)) \
            if self.limit > -1 else psycopg2_sql.SQL('')

    def prepare_sql(self, linkset_spec):
        prepare_sql = [matching_method_prop.prepare_sql
                       for matching_method_prop in self._matching_fields(linkset_spec)
                       if matching_method_prop.prepare_sql]

        if prepare_sql:
            return psycopg2_sql.SQL('\n').join(prepare_sql)

        return None

    def matching_fields_sql(self, linkset_spec):
        matching_fields_sqls = [psycopg2_sql.SQL('{}.uri').format(psycopg2_sql.Identifier(self.internal_id))]

        for matching_method_prop in self._matching_fields(linkset_spec):
            for property_field in [matching_method_prop.prop_original, matching_method_prop.prop_normalized]:
                if property_field:
                    matching_fields_sqls.append(psycopg2_sql.SQL('{matching_field} AS {name}').format(
                        matching_field=property_field.sql,
                        name=psycopg2_sql.Identifier(property_field.hash)
                    ))

        return psycopg2_sql.SQL(',\n       ').join(matching_fields_sqls)

    def joins(self, linkset_spec=None):
        joins = Joins()
        self.set_joins_sql(linkset_spec, joins)
        return joins

    def set_joins_sql(self, linkset_spec, joins):
        if linkset_spec:
            for matching_method_prop in self._fields(linkset_spec):
                for property_field in [matching_method_prop.prop_original, matching_method_prop.prop_normalized]:
                    if property_field and property_field.is_list:
                        joins.add_join(property_field.left_join, property_field.extended_prop_label)

        for relation in self.related:
            self._r_get_join_sql(linkset_spec, relation, joins)

        for filter in self.filters:
            if filter.extend and filter.property_field.is_list:
                joins.add_join(filter.property_field.left_join, filter.property_field.extended_prop_label)

    def _fields(self, linkset_spec):
        return self._get_fields(linkset_spec, only_matching_fields=False)

    def _matching_fields(self, linkset_spec):
        return self._get_fields(linkset_spec, only_matching_fields=True)

    def _get_fields(self, linkset_spec, only_matching_fields=True):
        match_fields = linkset_spec.get_fields(only_matching_fields=only_matching_fields)
        match_ets_fields = match_fields.get(self.internal_id, {})

        return list(dict.fromkeys([match_field_property
                                   for match_field_label, match_field in match_ets_fields.items()
                                   for match_field_property in match_field['properties']]))

    def _r_get_filters(self, filter_obj):
        if filter_obj['type'] in ['AND', 'OR']:
            filters = []
            for condition in filter_obj['conditions']:
                condition_filters = self._r_get_filters(condition)
                if isinstance(condition_filters, list):
                    filters += condition_filters
                else:
                    filters.append(condition_filters)

            return filters

        property = PropertyField(filter_obj['property'], job=self._job)
        return FilterFunction(filter_obj, property)

    def _r_get_filter_sql(self, filter_obj):
        if filter_obj['type'] in ['AND', 'OR']:
            if not filter_obj['conditions']:
                return psycopg2_sql.SQL('')

            filter_sqls = map(self._r_get_filter_sql, filter_obj['conditions'])
            return psycopg2_sql.SQL('({})').format(psycopg2_sql.SQL('\n%s ' % filter_obj['type']).join(filter_sqls))

        property = PropertyField(filter_obj['property'], job=self._job)
        return FilterFunction(filter_obj, property).sql

    def _r_get_join_sql(self, linkset_spec, relation, joins):
        if isinstance(relation, list):
            for sub_relation in relation:
                self._r_get_join_sql(linkset_spec, sub_relation, joins)
            return

        remote_ets_internal_id = relation['entity_type_selection']
        remote_ets = self._job.get_entity_type_selection_by_internal_id(remote_ets_internal_id)

        local_property = PropertyField([self._data['internal_id'], relation['local_property']], job=self._job)
        remote_property = PropertyField([relation['entity_type_selection'], relation['remote_property']], job=self._job)

        if local_property.is_list:
            joins.add_join(local_property.left_join, local_property.extended_prop_label)

        lhs = local_property.sql
        rhs = remote_property.sql

        extra_filter = remote_ets.filter_sql
        if extra_filter != psycopg2_sql.SQL(''):
            extra_filter = psycopg2_sql.SQL('\nAND ({filter})').format(filter=extra_filter)

        joins.add_join(
            psycopg2_sql.SQL('LEFT JOIN timbuctoo.{view} AS {alias}\nON {lhs} = {rhs}{extra_filter}').format(
                view=psycopg2_sql.Identifier(remote_ets.table_name),
                alias=psycopg2_sql.Identifier(remote_ets_internal_id),
                lhs=lhs, rhs=rhs,
                extra_filter=extra_filter
            ), remote_ets_internal_id)

        remote_ets.set_joins_sql(linkset_spec, joins)
