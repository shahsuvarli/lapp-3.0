/*
  Warnings:

  - The primary key for the `State` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sales_org_id` on the `State` table. All the data in the column will be lost.
  - You are about to alter the column `state_name` on the `State` table. The data in that column could be lost. The data in that column will be cast from `String` to `String`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Project] DROP CONSTRAINT [FK_project_state_87hrr9];

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'State'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_State] (
    [state_id] INT NOT NULL IDENTITY(1,1),
    [state_name] VARCHAR(20)
);
SET IDENTITY_INSERT [dbo].[_prisma_new_State] ON;
IF EXISTS(SELECT * FROM [dbo].[State])
    EXEC('INSERT INTO [dbo].[_prisma_new_State] ([state_id],[state_name]) SELECT [state_id],[state_name] FROM [dbo].[State] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_State] OFF;
DROP TABLE [dbo].[State];
EXEC SP_RENAME N'dbo._prisma_new_State', N'State';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
