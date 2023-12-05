/*
  Warnings:

  - You are about to drop the column `material_id` on the `Material_Quoted` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Material_Quoted] DROP CONSTRAINT [FK__Material___mater__7E37BEF6];

-- AlterTable
ALTER TABLE [dbo].[Material_Quoted] DROP COLUMN [material_id];
ALTER TABLE [dbo].[Material_Quoted] ADD [material] VARCHAR(255);

-- AddForeignKey
ALTER TABLE [dbo].[Material_Quoted] ADD CONSTRAINT [FK__Material___mater__7E37BEF6] FOREIGN KEY ([material]) REFERENCES [dbo].[Material]([material_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
