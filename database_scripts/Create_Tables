-- criação da tabela technologies
create table technologies (
    id serial primary key,
    name varchar(50) not null
);

-- criação da tabela versions
create table versions (
    id serial primary key,
    name varchar(50) not null,
    technologies_id int references technologies(id),
    standard boolean,
    full_name varchar(100) not null,
    eos date,
    eol date
);

-- criação da tabela applications
create table applications (
    id serial primary key,
    name varchar(50) not null,
    active boolean
);

-- criação da tabela de associação applications_versions
create table applications_versions (
    id serial primary key,
    application_id int references applications(id),
    version_id int references versions(id)
);
