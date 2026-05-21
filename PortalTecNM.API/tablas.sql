IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Usuarios] (
    [Id] int NOT NULL IDENTITY,
    [Matricula] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Rol] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Usuarios] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Alumnos] (
    [Id] int NOT NULL IDENTITY,
    [Nombre] nvarchar(max) NOT NULL,
    [Apellidos] nvarchar(max) NOT NULL,
    [Carrera] nvarchar(max) NOT NULL,
    [Semestre] int NOT NULL,
    [UsuarioId] int NOT NULL,
    CONSTRAINT [PK_Alumnos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Alumnos_Usuarios_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [Usuarios] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Alumnos_UsuarioId] ON [Alumnos] ([UsuarioId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260430132824_InitialCreate', N'8.0.4');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Materias] (
    [Id] int NOT NULL IDENTITY,
    [Clave] nvarchar(max) NOT NULL,
    [Nombre] nvarchar(max) NOT NULL,
    [Creditos] int NOT NULL,
    CONSTRAINT [PK_Materias] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Calificaciones] (
    [Id] int NOT NULL IDENTITY,
    [Valor] int NOT NULL,
    [Unidad] int NOT NULL,
    [AlumnoId] int NOT NULL,
    [MateriaId] int NOT NULL,
    CONSTRAINT [PK_Calificaciones] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Calificaciones_Alumnos_AlumnoId] FOREIGN KEY ([AlumnoId]) REFERENCES [Alumnos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Calificaciones_Materias_MateriaId] FOREIGN KEY ([MateriaId]) REFERENCES [Materias] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Calificaciones_AlumnoId] ON [Calificaciones] ([AlumnoId]);
GO

CREATE INDEX [IX_Calificaciones_MateriaId] ON [Calificaciones] ([MateriaId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260511135612_AddMateriasYCalificaciones', N'8.0.4');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [ConceptosPago] (
    [Id] int NOT NULL IDENTITY,
    [Clave] nvarchar(max) NOT NULL,
    [Nombre] nvarchar(max) NOT NULL,
    [Monto] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_ConceptosPago] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Pagos] (
    [Id] int NOT NULL IDENTITY,
    [FechaSolicitud] datetime2 NOT NULL,
    [Estatus] nvarchar(max) NOT NULL,
    [ReferenciaBancaria] nvarchar(max) NOT NULL,
    [AlumnoId] int NOT NULL,
    [ConceptoPagoId] int NOT NULL,
    CONSTRAINT [PK_Pagos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Pagos_Alumnos_AlumnoId] FOREIGN KEY ([AlumnoId]) REFERENCES [Alumnos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Pagos_ConceptosPago_ConceptoPagoId] FOREIGN KEY ([ConceptoPagoId]) REFERENCES [ConceptosPago] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Pagos_AlumnoId] ON [Pagos] ([AlumnoId]);
GO

CREATE INDEX [IX_Pagos_ConceptoPagoId] ON [Pagos] ([ConceptoPagoId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260513132414_AddModuloFinanciero', N'8.0.4');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [ActividadesComplementarias] (
    [Id] int NOT NULL IDENTITY,
    [Nombre] nvarchar(max) NOT NULL,
    [Creditos] int NOT NULL,
    [Horas] int NOT NULL,
    [Estatus] nvarchar(max) NOT NULL,
    [AlumnoId] int NOT NULL,
    CONSTRAINT [PK_ActividadesComplementarias] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ActividadesComplementarias_Alumnos_AlumnoId] FOREIGN KEY ([AlumnoId]) REFERENCES [Alumnos] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [ServiciosSociales] (
    [Id] int NOT NULL IDENTITY,
    [Dependencia] nvarchar(max) NOT NULL,
    [Programa] nvarchar(max) NOT NULL,
    [FechaInicio] datetime2 NOT NULL,
    [FechaTermino] datetime2 NULL,
    [Estatus] nvarchar(max) NOT NULL,
    [AlumnoId] int NOT NULL,
    CONSTRAINT [PK_ServiciosSociales] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ServiciosSociales_Alumnos_AlumnoId] FOREIGN KEY ([AlumnoId]) REFERENCES [Alumnos] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_ActividadesComplementarias_AlumnoId] ON [ActividadesComplementarias] ([AlumnoId]);
GO

CREATE INDEX [IX_ServiciosSociales_AlumnoId] ON [ServiciosSociales] ([AlumnoId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260513135604_AddModuloDesarrollo', N'8.0.4');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Horarios] (
    [Id] int NOT NULL IDENTITY,
    [Dia] nvarchar(max) NOT NULL,
    [Hora] nvarchar(max) NOT NULL,
    [Aula] nvarchar(max) NOT NULL,
    [AlumnoId] int NOT NULL,
    [MateriaId] int NOT NULL,
    CONSTRAINT [PK_Horarios] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Horarios_Alumnos_AlumnoId] FOREIGN KEY ([AlumnoId]) REFERENCES [Alumnos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Horarios_Materias_MateriaId] FOREIGN KEY ([MateriaId]) REFERENCES [Materias] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Horarios_AlumnoId] ON [Horarios] ([AlumnoId]);
GO

CREATE INDEX [IX_Horarios_MateriaId] ON [Horarios] ([MateriaId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260516151154_AgregarTablaHorarios', N'8.0.4');
GO

COMMIT;
GO

