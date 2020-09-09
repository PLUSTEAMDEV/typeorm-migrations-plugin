CREATE FUNCTION public.augrade_total(from_calc timestamp without time zone, to_calc timestamp without time zone, id_time_unit character varying, id_location integer, id_classification integer, id_space integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$ 
  DECLARE
      metric  RECORD;
      tonnes  REAL;
      ounces  REAL;
      augrade REAL;
      bench_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure m ON d.measure_id = m.id
                   JOIN space_time st ON m.space_time_id = st.id
                   JOIN location l ON st.location_id = l.id
                   JOIN space_unit su ON l.space_unit_id = su.id
                   JOIN classification_metric cm ON d.classification_metric_id = cm.id
                   JOIN classification c ON cm.classification_id = c.id
                   JOIN metric_mineral mm ON cm.metric_mineral_id = mm.id
                   JOIN location l2 ON l.location_id = l2.id
          WHERE c.id = id_classification
            AND l.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
            AND su.id = 3
          GROUP BY mm.id
      );
      pit_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure ms on ms.id = d.measure_id
                   JOIN space_time st on ms.space_time_id = st.id
                   JOIN location l on st.location_id = l.id
                   JOIN space_unit su ON l.space_unit_id = su.id
                   JOIN location l2 ON CASE WHEN su.id = 3 THEN l.location_id = l2.id ELSE l2.id = l.id END
                   JOIN classification_metric cm on d.classification_metric_id = cm.id
                   JOIN classification c on cm.classification_id = c.id
                   JOIN metric_mineral mm on cm.metric_mineral_id = mm.id
          WHERE c.id = id_classification
            AND l2.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
          GROUP BY mm.id
      );
      mine_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure ms on ms.id = d.measure_id
                   JOIN space_time st on ms.space_time_id = st.id
                   JOIN location l on st.location_id = l.id
                   JOIN location l2 on l2.id = COALESCE(l.location_id, l.id)
                   JOIN location lmf on lmf.id = COALESCE(l2.location_id, COALESCE(l.location_id, l.id))
                   JOIN classification_metric cm on d.classification_metric_id = cm.id
                   JOIN classification c on cm.classification_id = c.id
                   JOIN metric_mineral mm on cm.metric_mineral_id = mm.id
          WHERE c.id = id_classification
            AND lmf.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
          GROUP BY mm.id
      );
  BEGIN
      IF id_space = 2 THEN
          OPEN pit_metrics;
          LOOP
              FETCH pit_metrics INTO metric;
              EXIT WHEN NOT FOUND;
              IF metric.id_metric = 3 THEN
                  tonnes = metric.value_metric;
              ELSE
                  ounces = metric.value_metric;
              END IF;
          END LOOP;
          CLOSE pit_metrics;
      ELSE
          IF id_space = 1 THEN
              OPEN mine_metrics;
              LOOP
                  FETCH mine_metrics INTO metric;
                  EXIT WHEN NOT FOUND;
                  IF metric.id_metric = 3 THEN
                      tonnes = metric.value_metric;
                  ELSE
                      ounces = metric.value_metric;
                  END IF;
              END LOOP;
              CLOSE mine_metrics;
          ELSE
              IF id_space = 3 THEN
                  OPEN bench_metrics;
                  LOOP
                      FETCH bench_metrics INTO metric;
                      EXIT WHEN NOT FOUND;
                      IF metric.id_metric = 3 THEN
                          tonnes = metric.value_metric;
                      ELSE
                          ounces = metric.value_metric;
                      END IF;
                  END LOOP;
                  CLOSE bench_metrics;
              END IF;
          END IF;
      END IF;
      IF tonnes = 0 THEN
          augrade = 0;
      ELSE
          augrade = ounces / tonnes;
      END IF;
      RETURN ROUND(augrade::NUMERIC, 2);
  END ;
  $$;
CREATE FUNCTION public.check_parent() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
  DECLARE
      parent_id INTEGER := 0;
      new_value INTEGER := 0;
  BEGIN
      SELECT space_unit_id
      INTO parent_id
      FROM space_unit
      WHERE NEW.space_unit_id = id;
      SELECT space_unit_id
      INTO new_value
      FROM location
      WHERE NEW.location_id = id;
      IF parent_id = new_value OR parent_id IS NULL AND new_value IS NULL
      THEN
          RETURN NEW;
      ELSE
          RAISE EXCEPTION 'The parent locality does not correspond to the locality';
      END IF;
  END;
  $$;
CREATE FUNCTION public.update_validate_import() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
    BEGIN
        IF OLD.status = 'approved' THEN
            RAISE EXCEPTION 'File it’s already approved and can’t be edited';
        ELSE
            IF OLD.status <> 'processed' AND NEW.status = 'approved' THEN
                RAISE EXCEPTION 'File must be processed before it gets approved';
            ELSE
                IF NEW.status = 'removed' AND ((NEW.status_context::JSON -> 'removed_reason')::VARCHAR IS NULL) THEN
                    RAISE EXCEPTION 'If the file is in the removed state, you must specify the reason';
                ELSE
                    IF OLD.status <> NEW.status THEN
                        NEW.updated_at = NOW();
                    END IF;
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END ;
    $$;
CREATE TABLE public.attribute (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    description character varying(100),
    value jsonb NOT NULL,
    type text
);
CREATE SEQUENCE public.attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.attribute_id_seq OWNED BY public.attribute.id;
CREATE TABLE public.attribute_type (
    type text NOT NULL
);
CREATE TABLE public.characteristic (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    description character varying(100),
    type text
);
CREATE TABLE public.characteristic_alias (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    characteristic_id integer
);
CREATE SEQUENCE public.characteristic_alias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.characteristic_alias_id_seq OWNED BY public.characteristic_alias.id;
CREATE SEQUENCE public.characteristic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.characteristic_id_seq OWNED BY public.characteristic.id;
CREATE TABLE public.characteristic_type (
    type text NOT NULL,
    icon text
);
CREATE TABLE public.classification (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    abbreviation character varying(10) NOT NULL,
    color character varying(25) NOT NULL,
    "group" boolean,
    description character varying(100),
    classification_id integer
);
CREATE TABLE public.classification_metric (
    id integer NOT NULL,
    classification_id integer NOT NULL,
    metric_mineral_id integer NOT NULL,
    equation character varying(100)
);
CREATE TABLE public.company (
    id integer NOT NULL,
    name character varying(40) NOT NULL,
    description character varying(100)
);
CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;
CREATE TABLE public.distinction (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    description character varying(100),
    characteristic_id integer NOT NULL,
    code integer
);
CREATE SEQUENCE public.distinction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.distinction_id_seq OWNED BY public.distinction.id;
CREATE TABLE public.distinction_value (
    id integer NOT NULL,
    start_date timestamp without time zone DEFAULT now() NOT NULL,
    end_date timestamp without time zone,
    value jsonb NOT NULL,
    distinction_id integer,
    location_id integer,
    metric_characteristic_id integer
);
CREATE SEQUENCE public.distinction_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.distinction_value_id_seq OWNED BY public.distinction_value.id;
CREATE TABLE public.equation_value (
    id integer NOT NULL,
    replace character varying(5),
    classification_metric1_id integer NOT NULL,
    classification_metric2_id integer,
    parameter_id integer
);
CREATE SEQUENCE public.equation_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.equation_value_id_seq OWNED BY public.equation_value.id;
CREATE TABLE public.factor (
    id integer NOT NULL,
    classification1_id integer NOT NULL,
    classification2_id integer NOT NULL,
    name character varying(5) NOT NULL,
    description character varying(255),
    color character varying(25) NOT NULL
);
CREATE SEQUENCE public.factor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.factor_id_seq OWNED BY public.factor.id;
CREATE TABLE public.import (
    id integer NOT NULL,
    name text NOT NULL,
    parameters jsonb NOT NULL,
    status_context jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status text,
    template_id integer,
    import_file_id integer,
    owner_id integer
);
CREATE TABLE public.import_file (
    id integer NOT NULL,
    file_name text NOT NULL,
    url character varying(100) NOT NULL,
    mime_type character varying(100),
    checksum text NOT NULL
);
CREATE SEQUENCE public.import_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.import_file_id_seq OWNED BY public.import_file.id;
CREATE SEQUENCE public.import_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.import_id_seq OWNED BY public.import.id;
CREATE TABLE public.import_status (
    status text NOT NULL
);
CREATE TABLE public.location (
    id integer NOT NULL,
    kml integer,
    name character varying(20) NOT NULL,
    description character varying(100),
    location_id integer,
    space_unit_id integer NOT NULL,
    value jsonb
);
CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;
CREATE TABLE public.measure (
    id integer NOT NULL,
    space_time_id integer,
    import_id integer
);
CREATE TABLE public.measure_detail (
    id integer NOT NULL,
    value real NOT NULL,
    measure_id integer NOT NULL,
    classification_metric_id integer NOT NULL,
    equa_calc character varying(100)
);
CREATE SEQUENCE public.measure_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.measure_detail_id_seq OWNED BY public.measure_detail.id;
CREATE TABLE public.measure_distinction (
    id integer NOT NULL,
    measure_id integer NOT NULL,
    distinction_id integer,
    distinction_value_id integer
);
CREATE SEQUENCE public.measure_distinction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.measure_distinction_id_seq OWNED BY public.measure_distinction.id;
CREATE SEQUENCE public.measure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.measure_id_seq OWNED BY public.measure.id;
CREATE TABLE public.metric (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    description character varying(100)
);
CREATE TABLE public.metric_alias (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    metric_mineral_id integer
);
CREATE SEQUENCE public.metric_alias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.metric_alias_id_seq OWNED BY public.metric_alias.id;
CREATE TABLE public.metric_attribute (
    id integer NOT NULL,
    attribute_id integer NOT NULL,
    classification_metric_id integer NOT NULL,
    value character varying NOT NULL
);
CREATE SEQUENCE public.metric_attribute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.metric_attribute_id_seq OWNED BY public.metric_attribute.id;
CREATE TABLE public.metric_characteristic (
    id integer NOT NULL,
    characteristic_id integer NOT NULL,
    metric_mineral_id integer
);
CREATE SEQUENCE public.metric_characteristic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.metric_characteristic_id_seq OWNED BY public.metric_characteristic.id;
CREATE SEQUENCE public.metric_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.metric_id_seq OWNED BY public.metric.id;
CREATE TABLE public.metric_mineral (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    description character varying(100),
    unit_default character varying(10) NOT NULL,
    metric_id integer NOT NULL,
    mineral_id integer
);
CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
CREATE TABLE public.mineral (
    id integer NOT NULL,
    name character varying(25) NOT NULL
);
CREATE SEQUENCE public.mineral_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.mineral_id_seq OWNED BY public.mineral.id;
CREATE TABLE public.parameter (
    id integer NOT NULL,
    name character varying(25) NOT NULL
);
CREATE SEQUENCE public.parameter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.parameter_id_seq OWNED BY public.parameter.id;
CREATE TABLE public.parameter_value (
    id integer NOT NULL,
    "from" timestamp without time zone NOT NULL,
    "to" timestamp without time zone,
    value real NOT NULL,
    distinction_id integer,
    location_id integer,
    parameter_id integer
);
CREATE SEQUENCE public.parameter_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.parameter_value_id_seq OWNED BY public.parameter_value.id;
CREATE TABLE public.space_time (
    id integer NOT NULL,
    "from" timestamp without time zone NOT NULL,
    "to" timestamp without time zone NOT NULL,
    location_id integer,
    time_unit_id character(5)
);
CREATE SEQUENCE public.space_time_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.space_time_id_seq OWNED BY public.space_time.id;
CREATE TABLE public.space_unit (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    description character varying(100),
    space_unit_id integer
);
CREATE TABLE public.space_unit_alias (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    space_unit_id integer
);
CREATE SEQUENCE public.space_unit_alias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.space_unit_alias_id_seq OWNED BY public.space_unit_alias.id;
CREATE SEQUENCE public.space_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.space_unit_id_seq OWNED BY public.space_unit.id;
CREATE TABLE public.template (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    parameters jsonb NOT NULL,
    type text,
    location_id integer,
    classification_id integer,
    space_unit_id integer
);
CREATE SEQUENCE public.template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.template_id_seq OWNED BY public.template.id;
CREATE TABLE public.template_type (
    type text NOT NULL
);
CREATE TABLE public.time_unit (
    id character(5) NOT NULL,
    name character varying(20) NOT NULL,
    description character varying(100)
);
CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);
CREATE TABLE public.users (
    id integer NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.attribute ALTER COLUMN id SET DEFAULT nextval('public.attribute_id_seq'::regclass);
ALTER TABLE ONLY public.characteristic ALTER COLUMN id SET DEFAULT nextval('public.characteristic_id_seq'::regclass);
ALTER TABLE ONLY public.characteristic_alias ALTER COLUMN id SET DEFAULT nextval('public.characteristic_alias_id_seq'::regclass);
ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);
ALTER TABLE ONLY public.distinction ALTER COLUMN id SET DEFAULT nextval('public.distinction_id_seq'::regclass);
ALTER TABLE ONLY public.distinction_value ALTER COLUMN id SET DEFAULT nextval('public.distinction_value_id_seq'::regclass);
ALTER TABLE ONLY public.equation_value ALTER COLUMN id SET DEFAULT nextval('public.equation_value_id_seq'::regclass);
ALTER TABLE ONLY public.factor ALTER COLUMN id SET DEFAULT nextval('public.factor_id_seq'::regclass);
ALTER TABLE ONLY public.import ALTER COLUMN id SET DEFAULT nextval('public.import_id_seq'::regclass);
ALTER TABLE ONLY public.import_file ALTER COLUMN id SET DEFAULT nextval('public.import_file_id_seq'::regclass);
ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);
ALTER TABLE ONLY public.measure ALTER COLUMN id SET DEFAULT nextval('public.measure_id_seq'::regclass);
ALTER TABLE ONLY public.measure_detail ALTER COLUMN id SET DEFAULT nextval('public.measure_detail_id_seq'::regclass);
ALTER TABLE ONLY public.measure_distinction ALTER COLUMN id SET DEFAULT nextval('public.measure_distinction_id_seq'::regclass);
ALTER TABLE ONLY public.metric ALTER COLUMN id SET DEFAULT nextval('public.metric_id_seq'::regclass);
ALTER TABLE ONLY public.metric_alias ALTER COLUMN id SET DEFAULT nextval('public.metric_alias_id_seq'::regclass);
ALTER TABLE ONLY public.metric_attribute ALTER COLUMN id SET DEFAULT nextval('public.metric_attribute_id_seq'::regclass);
ALTER TABLE ONLY public.metric_characteristic ALTER COLUMN id SET DEFAULT nextval('public.metric_characteristic_id_seq'::regclass);
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.mineral ALTER COLUMN id SET DEFAULT nextval('public.mineral_id_seq'::regclass);
ALTER TABLE ONLY public.parameter ALTER COLUMN id SET DEFAULT nextval('public.parameter_id_seq'::regclass);
ALTER TABLE ONLY public.parameter_value ALTER COLUMN id SET DEFAULT nextval('public.parameter_value_id_seq'::regclass);
ALTER TABLE ONLY public.space_time ALTER COLUMN id SET DEFAULT nextval('public.space_time_id_seq'::regclass);
ALTER TABLE ONLY public.space_unit ALTER COLUMN id SET DEFAULT nextval('public.space_unit_id_seq'::regclass);
ALTER TABLE ONLY public.space_unit_alias ALTER COLUMN id SET DEFAULT nextval('public.space_unit_alias_id_seq'::regclass);
ALTER TABLE ONLY public.template ALTER COLUMN id SET DEFAULT nextval('public.template_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.company
    ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY (id);
ALTER TABLE ONLY public.import_file
    ADD CONSTRAINT "PK_1c45e43598e6cde5b5934cfca7c" PRIMARY KEY (id);
ALTER TABLE ONLY public.classification
    ADD CONSTRAINT "PK_1dc9176492b73104aa3d19ccff4" PRIMARY KEY (id);
ALTER TABLE ONLY public.metric_characteristic
    ADD CONSTRAINT "PK_3451878483516aeab0073afdfd6" PRIMARY KEY (id);
ALTER TABLE ONLY public.equation_value
    ADD CONSTRAINT "PK_3d7fa2303f846b98cbc172faac4" PRIMARY KEY (id);
ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "PK_44821e6332d33d4958ceb24bf93" PRIMARY KEY (id);
ALTER TABLE ONLY public.time_unit
    ADD CONSTRAINT "PK_4496a64dfba20f0db0a2bb3aa1a" PRIMARY KEY (id);
ALTER TABLE ONLY public.factor
    ADD CONSTRAINT "PK_474c0e9d4ca1c181f178952187d" PRIMARY KEY (id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "PK_4ed733f5bcc70cec27187bd90eb" PRIMARY KEY (id);
ALTER TABLE ONLY public.metric_alias
    ADD CONSTRAINT "PK_4fa73ff2365884412d877d5fd52" PRIMARY KEY (id);
ALTER TABLE ONLY public.characteristic_alias
    ADD CONSTRAINT "PK_5204654ee9810aa162325269c0d" PRIMARY KEY (id);
ALTER TABLE ONLY public.distinction_value
    ADD CONSTRAINT "PK_557cdafba5a76160f1cf363014b" PRIMARY KEY (id);
ALTER TABLE ONLY public.metric_mineral
    ADD CONSTRAINT "PK_5de1eabeec2fb3e595cbfc8ea7d" PRIMARY KEY (id);
ALTER TABLE ONLY public.distinction
    ADD CONSTRAINT "PK_5fd76ec4dafda2d27a08a3c3690" PRIMARY KEY (id);
ALTER TABLE ONLY public.attribute_type
    ADD CONSTRAINT "PK_629ff7618ae119c9081f463528b" PRIMARY KEY (type);
ALTER TABLE ONLY public.measure_distinction
    ADD CONSTRAINT "PK_67eaf90ae725c4043aa5fa2421d" PRIMARY KEY (id);
ALTER TABLE ONLY public.mineral
    ADD CONSTRAINT "PK_7163ddfaca3b9fc68b150c662cc" PRIMARY KEY (id);
ALTER TABLE ONLY public.import_status
    ADD CONSTRAINT "PK_76e6286de5544714fb09afc75a2" PRIMARY KEY (status);
ALTER TABLE ONLY public.space_unit
    ADD CONSTRAINT "PK_7c597329ee1c82ea5f49834aa51" PRIMARY KEY (id);
ALTER TABLE ONLY public.metric
    ADD CONSTRAINT "PK_7d24c075ea2926dd32bd1c534ce" PRIMARY KEY (id);
ALTER TABLE ONLY public.metric_attribute
    ADD CONSTRAINT "PK_7eee85dd0c88f6791d03de88ae0" PRIMARY KEY (id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY (id);
ALTER TABLE ONLY public.characteristic
    ADD CONSTRAINT "PK_88f998ec743440a5c758e08ece4" PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
ALTER TABLE ONLY public.space_time
    ADD CONSTRAINT "PK_9e452500bd8687f88660865887f" PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
ALTER TABLE ONLY public.space_unit_alias
    ADD CONSTRAINT "PK_b11bb70fc8640dea7e85f2c6a35" PRIMARY KEY (id);
ALTER TABLE ONLY public.attribute
    ADD CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY (id);
ALTER TABLE ONLY public.template_type
    ADD CONSTRAINT "PK_b8fd7bfefde6ddb404faa414176" PRIMARY KEY (type);
ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT "PK_cc5c047040f9c69f0e0d6a844a0" PRIMARY KEY (id);
ALTER TABLE ONLY public.characteristic_type
    ADD CONSTRAINT "PK_cfe4cf9457327687d14bb551401" PRIMARY KEY (type);
ALTER TABLE ONLY public.measure
    ADD CONSTRAINT "PK_ddc1ad2a86717cedc808809423e" PRIMARY KEY (id);
ALTER TABLE ONLY public.classification_metric
    ADD CONSTRAINT "PK_e5199e7551cb74baa1b8a3d29d8" PRIMARY KEY (id);
ALTER TABLE ONLY public.template
    ADD CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY (id);
ALTER TABLE ONLY public.measure_detail
    ADD CONSTRAINT "PK_fc63f70a313895363a1665495bc" PRIMARY KEY (id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "REL_303047526a80afbfa9f2fb73f9" UNIQUE (import_file_id);
ALTER TABLE ONLY public.equation_value
    ADD CONSTRAINT "UQ_8fd7ecfee04229ca1a6b676a52e" UNIQUE (classification_metric2_id);
ALTER TABLE ONLY public.metric_characteristic
    ADD CONSTRAINT "UQ_cfaac0c5965a5ab455961e68e7a" UNIQUE (metric_mineral_id);
CREATE UNIQUE INDEX attribute_ak_1 ON public.attribute USING btree (name);
CREATE UNIQUE INDEX attribute_pk ON public.attribute USING btree (id);
CREATE UNIQUE INDEX attribute_type_pk ON public.attribute_type USING btree (type);
CREATE UNIQUE INDEX characteristic_ak_1 ON public.characteristic USING btree (name);
CREATE UNIQUE INDEX characteristic_alias_ak_1 ON public.characteristic_alias USING btree (name);
CREATE UNIQUE INDEX characteristic_alias_pk ON public.characteristic_alias USING btree (id);
CREATE UNIQUE INDEX characteristic_pk ON public.characteristic USING btree (id);
CREATE UNIQUE INDEX characteristic_type_pk ON public.characteristic_type USING btree (type);
CREATE UNIQUE INDEX classification_ak_1 ON public.classification USING btree (abbreviation);
CREATE UNIQUE INDEX classification_metric_ak_1 ON public.classification_metric USING btree (classification_id, metric_mineral_id);
CREATE UNIQUE INDEX classification_metric_pk ON public.classification_metric USING btree (id);
CREATE UNIQUE INDEX classification_pk ON public.classification USING btree (id);
CREATE UNIQUE INDEX co_relation_uk ON public.factor USING btree (classification1_id, classification2_id);
CREATE UNIQUE INDEX company_ak_1 ON public.company USING btree (name);
CREATE UNIQUE INDEX company_pk ON public.company USING btree (id);
CREATE UNIQUE INDEX distinction_idx_1 ON public.distinction USING btree (characteristic_id, code);
CREATE UNIQUE INDEX distinction_pk ON public.distinction USING btree (id);
CREATE UNIQUE INDEX distinction_value_pk ON public.distinction_value USING btree (id);
CREATE UNIQUE INDEX equation_value_ak_1 ON public.equation_value USING btree (classification_metric1_id, classification_metric2_id);
CREATE UNIQUE INDEX equation_value_pk ON public.equation_value USING btree (id);
CREATE UNIQUE INDEX factor_ak_2 ON public.factor USING btree (name);
CREATE UNIQUE INDEX factor_pk ON public.factor USING btree (id);
CREATE UNIQUE INDEX import_file_pk ON public.import_file USING btree (id);
CREATE UNIQUE INDEX import_pk ON public.import USING btree (id);
CREATE UNIQUE INDEX import_status_pk ON public.import_status USING btree (status);
CREATE UNIQUE INDEX location_ak_1 ON public.location USING btree (location_id, name);
CREATE UNIQUE INDEX measure_descriptor_uk ON public.measure_distinction USING btree (distinction_id, measure_id);
CREATE UNIQUE INDEX measure_detail_ak_1 ON public.measure_detail USING btree (classification_metric_id, measure_id);
CREATE UNIQUE INDEX measure_detail_pk ON public.measure_detail USING btree (id);
CREATE UNIQUE INDEX measure_distinction_pk ON public.measure_distinction USING btree (id);
CREATE UNIQUE INDEX measure_pk ON public.measure USING btree (id);
CREATE UNIQUE INDEX metric_ak_1 ON public.metric USING btree (name);
CREATE UNIQUE INDEX metric_alias_ak_1 ON public.metric_alias USING btree (name);
CREATE UNIQUE INDEX metric_alias_pk ON public.metric_alias USING btree (id);
CREATE UNIQUE INDEX metric_attribute_ak_1 ON public.metric_attribute USING btree (attribute_id, classification_metric_id);
CREATE UNIQUE INDEX metric_attribute_pk ON public.metric_attribute USING btree (id);
CREATE UNIQUE INDEX metric_characteristic_ak_1 ON public.metric_characteristic USING btree (characteristic_id, metric_mineral_id);
CREATE UNIQUE INDEX metric_characteristic_pk ON public.metric_characteristic USING btree (id);
CREATE UNIQUE INDEX metric_mineral_ak_1 ON public.metric_mineral USING btree (metric_id, mineral_id, name);
CREATE UNIQUE INDEX metric_mineral_pk ON public.metric_mineral USING btree (id);
CREATE UNIQUE INDEX metric_pk ON public.metric USING btree (id);
CREATE UNIQUE INDEX mineral_pk ON public.mineral USING btree (id);
CREATE UNIQUE INDEX parameter_pk ON public.parameter USING btree (id);
CREATE UNIQUE INDEX parameter_value_pk ON public.parameter_value USING btree (id);
CREATE UNIQUE INDEX space_time_pk ON public.space_time USING btree (id);
CREATE UNIQUE INDEX space_unit_ak_1 ON public.space_unit USING btree (name);
CREATE UNIQUE INDEX space_unit_alias_pk ON public.space_unit_alias USING btree (id);
CREATE UNIQUE INDEX space_unit_pk ON public.space_unit USING btree (id);
CREATE UNIQUE INDEX template_pk ON public.template USING btree (id);
CREATE UNIQUE INDEX template_type_pk ON public.template_type USING btree (type);
CREATE UNIQUE INDEX time_unit_pk ON public.time_unit USING btree (id);
CREATE UNIQUE INDEX users_pk ON public.users USING btree (id);
CREATE TRIGGER unit_location_parent BEFORE INSERT ON public.location FOR EACH ROW EXECUTE PROCEDURE public.check_parent();
CREATE TRIGGER update_validate_import BEFORE UPDATE ON public.import FOR EACH ROW EXECUTE PROCEDURE public.update_validate_import();
ALTER TABLE ONLY public.measure
    ADD CONSTRAINT "FK_07367ccda8637c515ccab6b4e35" FOREIGN KEY (import_id) REFERENCES public.import(id);
ALTER TABLE ONLY public.distinction_value
    ADD CONSTRAINT "FK_086fd248b8fee12bae1f301ad2c" FOREIGN KEY (distinction_id) REFERENCES public.distinction(id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "FK_09b63cb32c1a044054f4b57c198" FOREIGN KEY (template_id) REFERENCES public.template(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.space_unit
    ADD CONSTRAINT "FK_0ad86646efebd360c70bd987692" FOREIGN KEY (space_unit_id) REFERENCES public.space_unit(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.attribute
    ADD CONSTRAINT "FK_0dbafd93b752dcf58fbd7caac64" FOREIGN KEY (type) REFERENCES public.attribute_type(type);
ALTER TABLE ONLY public.metric_alias
    ADD CONSTRAINT "FK_12a23de57d3d099a43fd749f9c4" FOREIGN KEY (metric_mineral_id) REFERENCES public.metric_mineral(id);
ALTER TABLE ONLY public.template
    ADD CONSTRAINT "FK_12c3c81a2f343f9224920fb38db" FOREIGN KEY (classification_id) REFERENCES public.classification(id);
ALTER TABLE ONLY public.metric_mineral
    ADD CONSTRAINT "FK_14759d2334ed742317f1d6a7687" FOREIGN KEY (mineral_id) REFERENCES public.mineral(id);
ALTER TABLE ONLY public.metric_mineral
    ADD CONSTRAINT "FK_1ad9805277d9cb4ed7d64d471d9" FOREIGN KEY (metric_id) REFERENCES public.metric(id);
ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_1b5c4f45015f1759b45920a4cfb" FOREIGN KEY (parameter_id) REFERENCES public.parameter(id);
ALTER TABLE ONLY public.classification_metric
    ADD CONSTRAINT "FK_1ed903d7b247b9a648e9db15320" FOREIGN KEY (classification_id) REFERENCES public.classification(id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "FK_23c652da6e3c4cc7b29202282c8" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.measure_detail
    ADD CONSTRAINT "FK_2e7b9c4a4b1aa03a2d54cf45d4b" FOREIGN KEY (classification_metric_id) REFERENCES public.classification_metric(id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "FK_303047526a80afbfa9f2fb73f97" FOREIGN KEY (import_file_id) REFERENCES public.import_file(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_33f0a569e80c34a4e2d778440eb" FOREIGN KEY (location_id) REFERENCES public.location(id);
ALTER TABLE ONLY public.characteristic_alias
    ADD CONSTRAINT "FK_3ba65dc1c329938f1693feb9417" FOREIGN KEY (characteristic_id) REFERENCES public.characteristic(id);
ALTER TABLE ONLY public.factor
    ADD CONSTRAINT "FK_3f473384597d923f645b2a72498" FOREIGN KEY (classification2_id) REFERENCES public.classification(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.distinction_value
    ADD CONSTRAINT "FK_3f4b843238cb3ca89320d859e4e" FOREIGN KEY (metric_characteristic_id) REFERENCES public.metric_characteristic(id);
ALTER TABLE ONLY public.space_time
    ADD CONSTRAINT "FK_447f54e1f9b58962e2f78c00117" FOREIGN KEY (location_id) REFERENCES public.location(id);
ALTER TABLE ONLY public.measure_distinction
    ADD CONSTRAINT "FK_46a4049a20af8178308ab5f67b3" FOREIGN KEY (distinction_id) REFERENCES public.distinction(id);
ALTER TABLE ONLY public.equation_value
    ADD CONSTRAINT "FK_50d028c7d7fa6dd13bc833f01f3" FOREIGN KEY (parameter_id) REFERENCES public.parameter(id);
ALTER TABLE ONLY public.distinction_value
    ADD CONSTRAINT "FK_54e833973fd48cb741e45c949bb" FOREIGN KEY (location_id) REFERENCES public.location(id);
ALTER TABLE ONLY public.import
    ADD CONSTRAINT "FK_5a2edf3ad5874f6ef78fc8937bb" FOREIGN KEY (status) REFERENCES public.import_status(status);
ALTER TABLE ONLY public.metric_attribute
    ADD CONSTRAINT "FK_62e3069425a689d9b2564f67be4" FOREIGN KEY (classification_metric_id) REFERENCES public.classification_metric(id);
ALTER TABLE ONLY public.template
    ADD CONSTRAINT "FK_6d2c805b3d2eb1fa6ebe2b867ca" FOREIGN KEY (space_unit_id) REFERENCES public.space_unit(id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT "FK_717309513d9c995e569545b5f64" FOREIGN KEY (space_unit_id) REFERENCES public.space_unit(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.space_unit_alias
    ADD CONSTRAINT "FK_74d3a39fffdd163ce6aebd6b42b" FOREIGN KEY (space_unit_id) REFERENCES public.space_unit(id);
ALTER TABLE ONLY public.classification
    ADD CONSTRAINT "FK_81140cafc4162a2c0c11aa9525f" FOREIGN KEY (classification_id) REFERENCES public.classification(id);
ALTER TABLE ONLY public.distinction
    ADD CONSTRAINT "FK_823f3c253e3adbd5e6c39fcb964" FOREIGN KEY (characteristic_id) REFERENCES public.characteristic(id);
ALTER TABLE ONLY public.equation_value
    ADD CONSTRAINT "FK_88e555a84df6fb6a23c3b69890d" FOREIGN KEY (classification_metric1_id) REFERENCES public.classification_metric(id);
ALTER TABLE ONLY public.equation_value
    ADD CONSTRAINT "FK_8fd7ecfee04229ca1a6b676a52e" FOREIGN KEY (classification_metric2_id) REFERENCES public.classification_metric(id);
ALTER TABLE ONLY public.factor
    ADD CONSTRAINT "FK_92704f93014e955b062c10f0b37" FOREIGN KEY (classification1_id) REFERENCES public.classification(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.template
    ADD CONSTRAINT "FK_96f38b63fca0acb1b3fc5220c5e" FOREIGN KEY (type) REFERENCES public.template_type(type);
ALTER TABLE ONLY public.measure_distinction
    ADD CONSTRAINT "FK_99762f47ca43b2607488c666b59" FOREIGN KEY (measure_id) REFERENCES public.measure(id);
ALTER TABLE ONLY public.space_time
    ADD CONSTRAINT "FK_a8f9bff8b6f8d2a7671852e2b66" FOREIGN KEY (time_unit_id) REFERENCES public.time_unit(id);
ALTER TABLE ONLY public.measure
    ADD CONSTRAINT "FK_b5a5476e4c31efd6934146fd6ad" FOREIGN KEY (space_time_id) REFERENCES public.space_time(id);
ALTER TABLE ONLY public.location
    ADD CONSTRAINT "FK_b6e6c23b493859e5875de66c18d" FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.characteristic
    ADD CONSTRAINT "FK_c829650a67cb5e15141c31ae9bc" FOREIGN KEY (type) REFERENCES public.characteristic_type(type);
ALTER TABLE ONLY public.measure_detail
    ADD CONSTRAINT "FK_c8f3de7be2432c20821e504638f" FOREIGN KEY (measure_id) REFERENCES public.measure(id);
ALTER TABLE ONLY public.metric_characteristic
    ADD CONSTRAINT "FK_cfaac0c5965a5ab455961e68e7a" FOREIGN KEY (metric_mineral_id) REFERENCES public.metric_mineral(id);
ALTER TABLE ONLY public.metric_characteristic
    ADD CONSTRAINT "FK_de2d58635fc8e9d7e6a4c3b55ce" FOREIGN KEY (characteristic_id) REFERENCES public.characteristic(id);
ALTER TABLE ONLY public.metric_attribute
    ADD CONSTRAINT "FK_e63676a6fec226caff3ea5029ae" FOREIGN KEY (attribute_id) REFERENCES public.attribute(id);
ALTER TABLE ONLY public.classification_metric
    ADD CONSTRAINT "FK_efdea99d8cb31115a23d7d4c030" FOREIGN KEY (metric_mineral_id) REFERENCES public.metric_mineral(id);
ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_f2b13fc6822f2c4d6c68c663e26" FOREIGN KEY (distinction_id) REFERENCES public.distinction(id);
ALTER TABLE ONLY public.template
    ADD CONSTRAINT "FK_f8b4eac09f6c45bdb5870fa3ad9" FOREIGN KEY (location_id) REFERENCES public.location(id);
