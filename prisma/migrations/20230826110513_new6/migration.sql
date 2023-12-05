/*
  Warnings:

  - You are about to drop the column `state_name` on the `State` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[State] DROP COLUMN [state_name];
ALTER TABLE [dbo].[State] ADD CONSTRAINT PK__State__81A4741770A01248 PRIMARY KEY CLUSTERED ([state_id]);
ALTER TABLE [dbo].[State] ADD [sales_org_id] INT,
[state_long_name] VARCHAR(50),
[state_short_name] VARCHAR(2);

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_state_state_id_9h3dnj] FOREIGN KEY ([state]) REFERENCES [dbo].[State]([state_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[State] ADD CONSTRAINT [FK__State__sales_org__58F12BAE] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
