--
-- PostgreSQL database dump
--

\restrict hAvPBBkHudBKkTg5TDpcqte9BJ15U3GNdBVoeQQzbqMVF9GNjxfCsqRa13GAAbC

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg12+1)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN NEW.updated_at = NOW(); RETURN NEW; END;$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: email_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_subscriptions (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    subscribed_at timestamp without time zone DEFAULT now(),
    discount_code character varying(20) DEFAULT 'BEMS10'::character varying,
    is_active boolean DEFAULT true
);


--
-- Name: email_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_subscriptions_id_seq OWNED BY public.email_subscriptions.id;


--
-- Name: issue_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issue_activities (
    id integer NOT NULL,
    issue_id integer,
    actor_type character varying(20) NOT NULL,
    actor_name character varying(255),
    action text NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT issue_activities_actor_type_check CHECK (((actor_type)::text = ANY ((ARRAY['customer'::character varying, 'admin'::character varying, 'system'::character varying])::text[])))
);


--
-- Name: issue_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.issue_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: issue_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.issue_activities_id_seq OWNED BY public.issue_activities.id;


--
-- Name: issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issues (
    id integer NOT NULL,
    order_id character varying(30),
    user_id integer,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    photo_urls text[] DEFAULT '{}'::text[],
    status character varying(50) DEFAULT 'open'::character varying NOT NULL,
    admin_notes text,
    resolution text,
    resolved_by integer,
    resolved_at timestamp without time zone,
    refund_amount numeric(10,2),
    refund_status character varying(30),
    paystack_refund_id character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT issues_refund_status_check CHECK (((refund_status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying])::text[]))),
    CONSTRAINT issues_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'under_review'::character varying, 'resolved_refund'::character varying, 'resolved_replacement'::character varying, 'resolved_no_action'::character varying, 'closed'::character varying])::text[]))),
    CONSTRAINT issues_type_check CHECK (((type)::text = ANY ((ARRAY['damaged_item'::character varying, 'wrong_item'::character varying, 'missing_item'::character varying, 'late_delivery'::character varying, 'not_delivered'::character varying, 'quality_issue'::character varying, 'other'::character varying])::text[])))
);


--
-- Name: issues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.issues_id_seq OWNED BY public.issues.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id character varying(30),
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id character varying(30) NOT NULL,
    user_id integer,
    total numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    payment_ref character varying(100),
    address text,
    tracking_status character varying(50) DEFAULT 'order_placed'::character varying,
    tracking_notes text,
    cancel_reason text,
    cancelled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    unit character varying(100),
    description text,
    is_featured boolean DEFAULT false,
    image_url text,
    category_id integer,
    stock integer DEFAULT 100,
    low_stock_threshold integer DEFAULT 10,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    order_id character varying(30),
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1,
    reason character varying(50),
    description text,
    status character varying(30) DEFAULT 'submitted'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    role character varying(20) DEFAULT 'user'::character varying,
    phone character varying(20),
    email_verified boolean DEFAULT false,
    verification_token character varying(100),
    reset_token character varying(100),
    reset_expires timestamp without time zone,
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp without time zone,
    refresh_token text,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: email_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.email_subscriptions_id_seq'::regclass);


--
-- Name: issue_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issue_activities ALTER COLUMN id SET DEFAULT nextval('public.issue_activities_id_seq'::regclass);


--
-- Name: issues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues ALTER COLUMN id SET DEFAULT nextval('public.issues_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, user_id, product_id, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name) FROM stdin;
1	Grains & Cereals
2	Vegetables
3	Cooking Oils
4	Legumes
5	Tubers & Roots
6	Spices & Seasonings
7	Leafy Greens
8	Fruits
\.


--
-- Data for Name: email_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_subscriptions (id, email, subscribed_at, discount_code, is_active) FROM stdin;
\.


--
-- Data for Name: issue_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.issue_activities (id, issue_id, actor_type, actor_name, action, note, created_at) FROM stdin;
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.issues (id, order_id, user_id, type, title, description, photo_urls, status, admin_notes, resolution, resolved_by, resolved_at, refund_amount, refund_status, paystack_refund_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
1	BF-MQM20HLE	3	1	1.80
2	BF-MQM3C3L1	19	1	2.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total, status, payment_method, payment_ref, address, tracking_status, tracking_notes, cancel_reason, cancelled_at, created_at) FROM stdin;
BF-MQM20HLE	1	3200.00	cancelled	paystack	BF-1781941554366-weyr	No 60 Enugu Road by Igbere Street, Umuahia, Abia, Umuahia, Abia	order_placed	\N	Ordered by mistake	2026-06-20 07:48:37.99676	2026-06-20 07:46:28.753216
BF-MQM3C3L1	1	3500.00	pending	paystack	BF-1781943776863-odo3	No 60 Enugu Road by Igbere Street, Umuahia, Abia, Umuahia, Abia	order_placed	\N	\N	\N	2026-06-20 08:23:30.084258
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, price, unit, description, is_featured, image_url, category_id, stock, low_stock_threshold, created_at) FROM stdin;
1	Ofada Rice	2.50	1 kg bag	Premium local Nigerian rice with rich aroma	t	\N	1	200	10	2026-06-18 02:39:06.572134
2	Palm Oil	3.00	1 litre bottle	Pure red palm oil, cold-pressed from fresh fruit	t	\N	3	150	10	2026-06-18 02:39:06.572134
6	Ugu Leaves	0.60	Large bunch	Fresh pumpkin leaves, rich in iron and vitamins	f	\N	7	80	10	2026-06-18 02:39:06.572134
7	Groundnut Oil	2.80	1 litre bottle	Cold-pressed groundnut oil with mild flavour	f	\N	3	100	10	2026-06-18 02:39:06.572134
8	Dried Crayfish	2.20	200 g pack	Ground sun-dried crayfish for authentic Nigerian soups	t	\N	6	60	10	2026-06-18 02:39:06.572134
11	Brown Rice	2.70	1 kg bag	Whole-grain brown rice, unpolished and rich in fiber	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782028024/Brown_Rice_wlvqxo.webp	1	140	10	2026-06-20 06:52:20.97786
3	Black-eyed Beans	1.80	1 kg bag	Protein-rich Nigerian beans, freshly harvested	t	\N	4	180	10	2026-06-18 02:39:06.572134
12	Millet	1.60	1 kg bag	Gluten-free whole grain millet, a Northern Nigerian staple	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782028258/Millet_g1t2n9.png	1	100	10	2026-06-20 06:52:20.97786
13	Sorghum (Guinea Corn)	1.50	1 kg bag	Traditional guinea corn, ideal for pap and local brewing	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782028518/Sorghum_Guinea_Corn_a0xhvg.jpg	1	90	10	2026-06-20 06:52:20.97786
14	Dried Maize	1.30	1 kg bag	Sun-dried whole maize kernels for pap, tuwo, and roasting	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782028774/Dried_Maize_rmiddz.jpg	1	130	10	2026-06-20 06:52:20.97786
15	Plantain	1.20	Bunch (5-6 pieces)	Ripe yellow plantain, perfect for frying or boiling	t	https://res.cloudinary.com/dyzkjerez/image/upload/v1782029001/Plantain_expe9k.jpg	8	160	10	2026-06-20 06:52:20.97786
16	Watermelon	1.80	Whole (medium)	Sweet, juicy whole watermelon	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782029227/Watermelon_lb4t92.png	8	70	10	2026-06-20 06:52:20.97786
17	Pineapple	1.40	Whole	Sweet ripe pineapple, locally grown	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782029408/Pineapple_rbc4it.jpg	8	85	10	2026-06-20 06:52:20.97786
5	Fresh Tomatoes	0.80	500 g punnet	Sun-ripened plum tomatoes, perfect for stews	t	https://res.cloudinary.com/dyzkjerez/image/upload/v1782031933/Fresh_Tomatoes_imdx08.webp	2	120	10	2026-06-18 02:39:06.572134
9	White Yam	1.50	1 kg chunk	Premium pounded-yam-quality white yam	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782032114/White_Yam_hbiwgg.webp	5	110	10	2026-06-18 02:39:06.572134
4	Garri (Ijebu)	1.20	1 kg bag	Fine-grained, slightly sour Ijebu-style garri	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1780142399/white_garri_zaq8i4.png	1	90	10	2026-06-18 02:39:06.572134
10	Fresh Pepper	0.70	300 g pack	Sweet red bell pepper blended for stews	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782032473/Fresh_Pepper_tuktvd.jpg	2	95	10	2026-06-18 02:39:06.572134
18	Pawpaw (Papaya)	1.10	Whole (medium)	Ripe pawpaw, soft and naturally sweet	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782029583/Pawpaw_Papaya_i0qwvc.webp	8	75	10	2026-06-20 06:52:20.97786
20	Cassava	1.00	1 kg chunk	Fresh cassava root for garri, fufu, and akpu	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782030337/Cassava_ikmqwu.jpg	5	140	10	2026-06-20 06:52:20.97786
21	Sweet Potato	1.30	1 kg bag	Naturally sweet orange-fleshed sweet potato	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782030638/Sweet_Potato_bwnvdj.jpg	5	100	10	2026-06-20 06:52:20.97786
22	Cocoyam	1.50	1 kg bag	Fresh cocoyam, ideal for porridge and soups	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782030919/Cocoyam_czhszp.webp	5	80	10	2026-06-20 06:52:20.97786
23	Dried Pepper (Atarodo)	1.90	200 g pack	Sun-dried scotch bonnet pepper, fiery and aromatic	t	https://res.cloudinary.com/dyzkjerez/image/upload/v1782031086/Dried_Pepper_Atarodo_jh8t52.webp	6	90	10	2026-06-20 06:52:20.97786
24	Curry Powder	1.40	100 g pack	Aromatic curry powder blend for stews and rice	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782031304/Curry_Powder_vjtk55.webp	6	110	10	2026-06-20 06:52:20.97786
25	Dried Thyme	1.20	50 g pack	Dried thyme leaves, a stew and soup essential	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782031554/Dried_Thyme_hivo8n.jpg	6	120	10	2026-06-20 06:52:20.97786
26	Fresh Ginger	1.60	250 g pack	Fresh ginger root, peeled and ready to use	f	https://res.cloudinary.com/dyzkjerez/image/upload/v1782031672/Fresh_Ginger_ktstsp.png	6	95	10	2026-06-20 06:52:20.97786
19	Yellow Yam (Puna)	2.00	1 kg chunk	Premium Puna yellow yam, great for pounding and frying	t	https://res.cloudinary.com/dyzkjerez/image/upload/v1782029779/Yellow_Yam_Puna_q473sa.webp	5	119	10	2026-06-20 06:52:20.97786
27	White Rice (Imported)	4500.00	1kg bag	Premium long-grain white rice, ideal for jollof and fried rice	t	https://images.unsplash.com/photo-1536304993881-ff86e0c9dbe8?w=400&q=80	1	100	10	2026-06-23 18:19:57.434243
28	White Rice (Basmati)	3.20	1 kg bag	Premium basmati white rice, long-grain and fluffy	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42aPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2hpdGUgUmljZSAoQmFzbWF0aSk8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	1	150	10	2026-06-24 09:08:58.701798
29	Parboiled Rice	2.80	1 kg bag	Parboiled long-grain rice, easy to cook and firm	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42aPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFyYm9pbGVkIFJpY2U8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	1	130	10	2026-06-24 09:08:58.701798
30	Local White Rice	2.20	1 kg bag	Local Nigerian white rice, great for everyday cooking	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42aPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9jYWwgV2hpdGUgUmljZTwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjMwNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBob3RvIGNvbWluZyBzb29uPC90ZXh0Pjwvc3ZnPg==	1	200	10	2026-06-24 09:08:58.701798
31	Abakaliki Rice	2.50	1 kg bag	Authentic Abakaliki rice from Ebonyi State	t	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4y+PC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWJha2FsaWtpIFJpY2U8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	1	120	10	2026-06-24 09:08:58.701798
32	Honey Beans (Oloyin)	2.80	1 kg bag	Sweet honey beans, perfect for moi moi and porridge	t	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6uYPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9uZXkgQmVhbnMgKE9sb3lpbik8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	3	90	10	2026-06-24 09:08:58.701798
33	White Beans	2.40	1 kg bag	White navy beans, tender and mild	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imqo8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMUI0MzMyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XaGl0ZSBCZWFuczwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjMwNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBob3RvIGNvbWluZyBzb29uPC90ZXh0Pjwvc3ZnPg==	3	100	10	2026-06-24 09:08:58.701798
34	Green Beans	1.80	1 kg bag	Fresh green beans for soups and stir-fries	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6uYPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R3JlZW4gQmVhbnM8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	3	80	10	2026-06-24 09:08:58.701798
35	Onion (Red)	1.20	1 kg bag	Fresh red onions, a cooking essential	t	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6eFPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T25pb24gKFJlZCk8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	4	200	10	2026-06-24 09:08:58.701798
36	Onion (White)	1.30	1 kg bag	Fresh white onions, milder flavour	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imqo8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMUI0MzMyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PbmlvbiAoV2hpdGUpPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMzA2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG8gY29taW5nIHNvb248L3RleHQ+PC9zdmc+	4	160	10	2026-06-24 09:08:58.701798
37	Scotch Bonnet Pepper	1.40	250 g pack	Fresh scotch bonnet (rodo), fiery Nigerian heat	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4y277iPPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2NvdGNoIEJvbm5ldCBQZXBwZXI8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	4	120	10	2026-06-24 09:08:58.701798
38	Tatashe (Bell Pepper)	1.60	500 g pack	Red tatashe peppers for blending into tomato base	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6uRPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGF0YXNoZSAoQmVsbCBQZXBwZXIpPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMzA2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG8gY29taW5nIHNvb248L3RleHQ+PC9zdmc+	4	100	10	2026-06-24 09:08:58.701798
39	Fresh Ginger	1.50	200 g pack	Knobs of fresh ginger root, peeled and ready	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6uaPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RnJlc2ggR2luZ2VyPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMzA2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG8gY29taW5nIHNvb248L3RleHQ+PC9zdmc+	4	90	10	2026-06-24 09:08:58.701798
40	Spinach (Efo Tete)	1.20	1 bunch	Fresh Nigerian spinach, tender efo tete leaves	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WsPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3BpbmFjaCAoRWZvIFRldGUpPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMzA2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG8gY29taW5nIHNvb248L3RleHQ+PC9zdmc+	4	70	10	2026-06-24 09:08:58.701798
41	Cucumber	0.80	Whole	Fresh firm cucumber	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WSPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q3VjdW1iZXI8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIzMDYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90byBjb21pbmcgc29vbjwvdGV4dD48L3N2Zz4=	4	120	10	2026-06-24 09:08:58.701798
42	Carrot	1.10	500 g bag	Fresh carrots, great for stew and salads	f	data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEZGRjQiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjY0IiBmaWxsPSIjRDFGQUU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjU2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WVPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFCNDMzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2Fycm90PC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iMzA2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG8gY29taW5nIHNvb248L3RleHQ+PC9zdmc+	4	110	10	2026-06-24 09:08:58.701798
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns (id, order_id, user_id, product_id, quantity, reason, description, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, phone, email_verified, verification_token, reset_token, reset_expires, failed_login_attempts, locked_until, refresh_token, last_login, created_at) FROM stdin;
1	Obisesan Esther	est0295@gmail.com	$2b$12$JiYN7V5eRWEecgfOFJFp2.MoFuzj7px/fhFUE8svyH3Yi7AudK1L2	admin	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgyMjAyNjMxLCJleHAiOjE3ODQ3OTQ2MzF9.ad_xy7Kma9-S2vSzN6kirKPnIVGbmHlReGgOWMNfPjk	2026-06-23 08:17:11.626515	2026-06-18 03:16:46.199298
5	Paul	paulpobisesan822@gmail.com	$2b$12$dR5XXtweg6j6YpF8F167KuGLFp9iCbfI8ILR9dXWu0e6r46AZfDAq	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzgxOTQ2MzcxLCJleHAiOjE3ODQ1MzgzNzF9.G-_674EkpsOIrnZres4WT0uqgVDafSpUc8lHWn1K2Kg	\N	2026-06-20 09:06:11.091748
7	Debbie	debbieglobal@gmail.com	$2b$12$0.tHz19JJh8soe5uWIIBuOzuCvh9GgxydPBukjSKn5yfUMqKijGu6	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzgyMDEyMDU2LCJleHAiOjE3ODQ2MDQwNTZ9._4j_GVL02X60DKh6WIxSHHJBdtMNS4f6mgk1dBKm0_Q	\N	2026-06-21 03:20:56.403057
3	ADEKUNLE DANIEL	danieladekunle320@gmail.com	$2b$12$eMcZ6WiwQ3YFm/4AiZr2meCe6wInj8ulFRe6gcSLmtQZz.H0a7PSC	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgxODA0MTI5LCJleHAiOjE3ODQzOTYxMjl9.HOoqKcmvJNmbnHRejHhNrdE2JHa3kp2XGYRJR-T6-vw	\N	2026-06-18 17:35:29.215394
4	esther	dark_fury22@outlook.com	$2b$12$wORn1qIbORYqfbDByJv/jedh7kOlNhAhjwn767dZtx.KbEY9LdoGq	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzgxODMzODU4LCJleHAiOjE3ODQ0MjU4NTh9.e8A3aI9rvHVdrSkEjB0dAhidvJmTXSe46h101DT8_zg	\N	2026-06-19 01:50:58.278744
2	Deborah Ajayi	ajayidebby05@gmail.com	$2b$12$ouFOJY6piMtYqOcwHf4NwOo6ka3GFtzyopnsvQJPOZijyL19DTxWO	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzgxODU4NjMxLCJleHAiOjE3ODQ0NTA2MzF9.-1ZW2Nzg3pCGQIzy3w4Dj5ypDfEZU4MVKoK25wTCG7c	2026-06-19 08:43:51.973117	2026-06-18 16:36:35.142486
8	Lilian	mgbechi07@gmail.com	$2b$12$/..reNKQ9/Q6dMXG10nTmeclibwpsd5WI4rqoX3ELvV2fKaiBBe2a	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzgyMDMzMTg2LCJleHAiOjE3ODQ2MjUxODZ9.xbvC21CHeIqdLUYNsRJgTnx5so5i_9WxJg7iM5MntSc	2026-06-21 09:13:06.374115	2026-06-21 09:08:59.875411
6	Destiny	anachordestiniewoyike@gmail.com	$2b$12$BwVWBOIaPE.jDpgjzZLPEuMHT/Asc0N5r6bx4EZyh2bige7KIxcDC	user	\N	f	\N	\N	\N	0	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzgyMTIzODY4LCJleHAiOjE3ODQ3MTU4Njh9.ZbbXz2ZS5GVMGDJ6Uwfv6qqRbtsIf5kQU1RxTTzVoAE	2026-06-22 10:24:28.346396	2026-06-20 13:30:06.224163
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: email_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_subscriptions_id_seq', 1, false);


--
-- Name: issue_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.issue_activities_id_seq', 1, false);


--
-- Name: issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.issues_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 2, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 42, true);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: email_subscriptions email_subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriptions
    ADD CONSTRAINT email_subscriptions_email_key UNIQUE (email);


--
-- Name: email_subscriptions email_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_subscriptions
    ADD CONSTRAINT email_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: issue_activities issue_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issue_activities
    ADD CONSTRAINT issue_activities_pkey PRIMARY KEY (id);


--
-- Name: issues issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_cart_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_user ON public.cart_items USING btree (user_id);


--
-- Name: idx_issue_act; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issue_act ON public.issue_activities USING btree (issue_id);


--
-- Name: idx_issues_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issues_created ON public.issues USING btree (created_at DESC);


--
-- Name: idx_issues_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issues_order_id ON public.issues USING btree (order_id);


--
-- Name: idx_issues_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issues_status ON public.issues USING btree (status);


--
-- Name: idx_issues_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_issues_user_id ON public.issues USING btree (user_id);


--
-- Name: issues issues_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: issue_activities issue_activities_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issue_activities
    ADD CONSTRAINT issue_activities_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id) ON DELETE CASCADE;


--
-- Name: issues issues_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: issues issues_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: issues issues_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: returns returns_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: returns returns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict hAvPBBkHudBKkTg5TDpcqte9BJ15U3GNdBVoeQQzbqMVF9GNjxfCsqRa13GAAbC

