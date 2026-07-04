create table if not exists dim_fecha (
    id_fecha integer primary key,
    fecha date not null unique,
    anio integer not null,
    mes integer not null check (mes between 1 and 12),
    dia integer not null check (dia between 1 and 31),
    dia_semana text not null,
    es_feriado boolean not null default false,
    temporada text not null check (temporada in ('Alta', 'Media', 'Baja'))
);

create table if not exists dim_local (
    id_local integer primary key,
    local text not null unique,
    antiguedad text not null,
    perfil text not null,
    factor_venta numeric(8, 4) not null
);

create table if not exists dim_plato (
    id_plato integer primary key,
    plato text not null unique,
    categoria text not null,
    precio_unitario numeric(12, 2) not null,
    costo_unitario numeric(12, 2) not null
);

create table if not exists dim_turno (
    id_turno integer primary key,
    turno text not null unique,
    probabilidad numeric(8, 4) not null
);

create table if not exists fact_ventas (
    id_venta bigint primary key,
    id_fecha integer not null references dim_fecha(id_fecha),
    fecha date not null,
    anio integer not null,
    mes integer not null check (mes between 1 and 12),
    id_local integer not null references dim_local(id_local),
    id_turno integer not null references dim_turno(id_turno),
    id_plato integer not null references dim_plato(id_plato),
    cantidad integer not null check (cantidad > 0),
    precio_unitario numeric(12, 2) not null,
    costo_total numeric(12, 2) not null,
    descuento numeric(8, 4) not null default 0,
    monto_subtotal numeric(12, 2) not null,
    monto_descuento numeric(12, 2) not null,
    monto_total numeric(12, 2) not null,
    margen_bruto numeric(12, 2) not null,
    es_feriado boolean not null default false,
    temporada text not null check (temporada in ('Alta', 'Media', 'Baja'))
);

create index if not exists idx_fact_ventas_fecha on fact_ventas(id_fecha);
create index if not exists idx_fact_ventas_local on fact_ventas(id_local);
create index if not exists idx_fact_ventas_plato on fact_ventas(id_plato);
create index if not exists idx_fact_ventas_turno on fact_ventas(id_turno);
create index if not exists idx_fact_ventas_anio_mes on fact_ventas(anio, mes);
