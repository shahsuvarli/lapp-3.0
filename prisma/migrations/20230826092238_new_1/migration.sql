BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Account_Manager] (
    [account_manager_id] INT NOT NULL,
    [account_manager] VARCHAR(255),
    [sales_org_id] INT,
    [is_active] BIT,
    CONSTRAINT [PK__Account___294E22B08554CA09] PRIMARY KEY CLUSTERED ([account_manager_id])
);

-- CreateTable
CREATE TABLE [dbo].[Channel] (
    [channel_id] INT NOT NULL,
    [channel_name] VARCHAR(255),
    [is_active] BIT,
    CONSTRAINT [PK__Channel__2D0861AB7D2B3C01] PRIMARY KEY CLUSTERED ([channel_id])
);

-- CreateTable
CREATE TABLE [dbo].[Competitor] (
    [competitor_id] INT NOT NULL IDENTITY(1,1),
    [competitor_name] VARCHAR(50),
    [sales_org_id] INT,
    [is_active] BIT CONSTRAINT [DF__Competito__is_ac__5CA1C101] DEFAULT 1,
    CONSTRAINT [PK__Competit__861A24E40D332C98] PRIMARY KEY CLUSTERED ([competitor_id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [sap_id] INT NOT NULL,
    [customer_name] VARCHAR(100),
    [city] VARCHAR(100),
    [state] VARCHAR(100),
    [country] VARCHAR(100),
    [price_group] VARCHAR(100),
    [datetime_added] DATETIME CONSTRAINT [DF__Customer__dateti__6E01572D] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Customer__5E8533EB8788A58B] PRIMARY KEY CLUSTERED ([sap_id])
);

-- CreateTable
CREATE TABLE [dbo].[DSM] (
    [dsm_id] INT NOT NULL,
    [dsm] VARCHAR(255),
    [sales_org_id] INT,
    [is_active] BIT,
    CONSTRAINT [PK__DSM__F23591D078A614D1] PRIMARY KEY CLUSTERED ([dsm_id])
);

-- CreateTable
CREATE TABLE [dbo].[Employees] (
    [employee_id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(100) NOT NULL,
    [name] VARCHAR(100),
    [surname] VARCHAR(100),
    [email] VARCHAR(255) NOT NULL,
    [position] VARCHAR(50),
    [created_date] DATE,
    [is_active] BIT,
    [sales_org_id] INT,
    CONSTRAINT [PK__employee__C52E0BA876DA549F] PRIMARY KEY CLUSTERED ([employee_id])
);

-- CreateTable
CREATE TABLE [dbo].[Material] (
    [material_id] VARCHAR(255) NOT NULL,
    [description] VARCHAR(255),
    [product_family] VARCHAR(50),
    [uom] VARCHAR(20),
    [stock_6100] INT,
    [stock_6120] INT,
    [stock_6130] INT,
    [stock_6140] INT,
    [price_group] VARCHAR(20),
    [copper_weight] DECIMAL(10,2),
    [cost_full_copper] DECIMAL(10,2),
    [condition_rate] DECIMAL(12,2),
    [pricing_unit] VARCHAR(20),
    [copper_adder] DECIMAL(5,2),
    [margin_hold_flag] BIT,
    [max_qty_discount] DECIMAL(5,2),
    [level_5_base_cu] DECIMAL(12,2),
    [level_5_full_cu] DECIMAL(12,2),
    [margin_mft_pc] DECIMAL(12,2),
    [sales_org_id] INT,
    CONSTRAINT [PK__tmp_ms_x__DEDA434489DEA300] PRIMARY KEY CLUSTERED ([material_id])
);

-- CreateTable
CREATE TABLE [dbo].[Material_Quoted] (
    [id] INT NOT NULL,
    [material_id] VARCHAR(255),
    [permanent_quote_id] INT,
    [quote_version] INT,
    [quantity] DECIMAL(10,2),
    [discount_percent] DECIMAL(12,2),
    [copper_base_price] DECIMAL(12,2),
    [full_base_price] DECIMAL(12,2),
    [is_manual_overwrite] BIT,
    [line_notes] VARCHAR(255),
    [line_value] DECIMAL(12,2),
    [line_cogs] DECIMAL(12,2),
    [margin_full_copper] DECIMAL(12,2),
    [quote_value] DECIMAL(10,2),
    [quote_cost] DECIMAL(10,2),
    [quote_margin] DECIMAL(10,2),
    CONSTRAINT [PK__Material__3213E83F657D0AD7] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Project] (
    [project_id] INT NOT NULL IDENTITY(10000,1),
    [sales_org_id] INT,
    [project_name] VARCHAR(255),
    [general_contractor] VARCHAR(50),
    [electrical_contractor] VARCHAR(50),
    [region] INT,
    [state] INT,
    [vertical_market] INT,
    [won_lost] VARCHAR(20),
    [status] VARCHAR(20),
    [channel] INT,
    [notes] VARCHAR(255),
    [total_value] DECIMAL(10,2),
    [ranking] INT,
    [created_by] INT,
    [created_date] DATE,
    [modified_by] INT,
    [modified_date] DATE,
    [datetime_added] DATETIME CONSTRAINT [DF_Project_datetime_added] DEFAULT CURRENT_TIMESTAMP,
    [total_cost] DECIMAL(10,2),
    [total_margin] DECIMAL(10,2),
    [deleted_by] INT,
    [deleted_date] DATE,
    [is_active] BIT CONSTRAINT [DF_project_is_active_2h9h2] DEFAULT 1,
    CONSTRAINT [PK__Project__BC799E1FBA1881F6] PRIMARY KEY CLUSTERED ([project_id])
);

-- CreateTable
CREATE TABLE [dbo].[Project_Competitor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [competitor_id] INT NOT NULL,
    [project_id] INT NOT NULL,
    [datetime_added] DATETIME CONSTRAINT [DF__Project_C__datet__634EBE90] DEFAULT CURRENT_TIMESTAMP,
    [is_active] BIT CONSTRAINT [DF__Project_C__is_ac__6442E2C9] DEFAULT 1,
    [deleted_by] INT,
    [deleted_date] DATETIME,
    CONSTRAINT [PK__Project___3213E83FBA34E227] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Project_Sap_Order] (
    [id] INT NOT NULL IDENTITY(1,1),
    [project_id] INT,
    [sap_order_id] INT,
    [datetime_added] DATETIME CONSTRAINT [DF__Project_S__datet__540C7B00] DEFAULT CURRENT_TIMESTAMP,
    [is_active] BIT CONSTRAINT [DF__Project_S__is_ac__58D1301D] DEFAULT 1,
    [deleted_by] INT,
    [deleted_date] DATETIME,
    CONSTRAINT [PK__Project___3213E83F59E4394D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Quote] (
    [quote_id] INT NOT NULL IDENTITY(5000,1),
    [project_id] INT,
    [sap_quote_id] INT,
    [sap_customer_id] INT,
    [quote_version] INT,
    [created_by] INT,
    [modified_by] INT,
    [created_date] DATE,
    [modified_date] DATE,
    [account_manager_id] INT,
    [dsm_id] INT,
    [copper_rate] DECIMAL(5,2),
    [deleted_by] INT,
    [deleted_date] DATETIME,
    [is_active] BIT CONSTRAINT [DF__Quote__is_active__6DCC4D03] DEFAULT 1,
    [datetime_added] DATETIME CONSTRAINT [DF__Quote__datetime___6EC0713C] DEFAULT CURRENT_TIMESTAMP,
    [quote_value] INT,
    [quote_cost] INT,
    [quote_margin] DECIMAL(10,1),
    [notes] TEXT,
    CONSTRAINT [PK__Quote__0D37DF0CA9A6B073] PRIMARY KEY CLUSTERED ([quote_id])
);

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [region_id] INT NOT NULL,
    [region_name] VARCHAR(255),
    [is_active] BIT,
    [sales_org_id] INT,
    CONSTRAINT [PK__Region__01146BAE5C334547] PRIMARY KEY CLUSTERED ([region_id])
);

-- CreateTable
CREATE TABLE [dbo].[Sales_Org] (
    [sales_org_id] INT NOT NULL,
    [sales_org] VARCHAR(255),
    [is_active] BIT,
    CONSTRAINT [PK__Sales_Or__F011BA5EE6BDD652] PRIMARY KEY CLUSTERED ([sales_org_id])
);

-- CreateTable
CREATE TABLE [dbo].[State] (
    [state_id] INT NOT NULL,
    [state_name] VARCHAR(255),
    [sales_org_id] INT,
    CONSTRAINT [PK__State__81A47417FA9C3D23] PRIMARY KEY CLUSTERED ([state_id])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [user_id] INT NOT NULL,
    [username] VARCHAR(255),
    [name] VARCHAR(255),
    [surname] VARCHAR(255),
    [position] VARCHAR(255),
    [email] VARCHAR(255),
    [created_date] DATE,
    [is_active] BIT,
    CONSTRAINT [PK__Users__B9BE370F57DBC44D] PRIMARY KEY CLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[Vertical_Market] (
    [vertical_market_id] INT NOT NULL,
    [vertical_market_name] VARCHAR(255),
    [is_active] BIT,
    CONSTRAINT [PK__Vertical__7A60A7C278DB2479] PRIMARY KEY CLUSTERED ([vertical_market_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Account_Manager] ADD CONSTRAINT [FK_account_manager_sales_org_7g3fje] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DSM] ADD CONSTRAINT [FK_dsm_sales_org_9h4fh] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Material] ADD CONSTRAINT [FK__Material__sales___7B5B524B] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Material_Quoted] ADD CONSTRAINT [FK__Material___mater__7E37BEF6] FOREIGN KEY ([material_id]) REFERENCES [dbo].[Material]([material_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK__Project__channel__160F4887] FOREIGN KEY ([channel]) REFERENCES [dbo].[Channel]([channel_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_created_by_930dok] FOREIGN KEY ([created_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_Project_deleted_by_78hf4d] FOREIGN KEY ([deleted_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_modified_by_3d7hifw] FOREIGN KEY ([modified_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_region_2309d2] FOREIGN KEY ([region]) REFERENCES [dbo].[Region]([region_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_sales_org_9237hd] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_state_87hrr9] FOREIGN KEY ([state]) REFERENCES [dbo].[State]([state_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [FK_project_ver_market_90j23] FOREIGN KEY ([vertical_market]) REFERENCES [dbo].[Vertical_Market]([vertical_market_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project_Competitor] ADD CONSTRAINT [FK__Project_C__delet__65370702] FOREIGN KEY ([competitor_id]) REFERENCES [dbo].[Competitor]([competitor_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project_Competitor] ADD CONSTRAINT [FK__Project_C__proje__662B2B3B] FOREIGN KEY ([project_id]) REFERENCES [dbo].[Project]([project_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project_Sap_Order] ADD CONSTRAINT [FK_Project_sap_order_8h39r] FOREIGN KEY ([project_id]) REFERENCES [dbo].[Project]([project_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__account_m__73852659] FOREIGN KEY ([account_manager_id]) REFERENCES [dbo].[Account_Manager]([account_manager_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__created_b__719CDDE7] FOREIGN KEY ([created_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__datetime___6FB49575] FOREIGN KEY ([project_id]) REFERENCES [dbo].[Project]([project_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__deleted_b__756D6ECB] FOREIGN KEY ([deleted_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__dsm_id__74794A92] FOREIGN KEY ([dsm_id]) REFERENCES [dbo].[DSM]([dsm_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__modified___72910220] FOREIGN KEY ([modified_by]) REFERENCES [dbo].[Employees]([employee_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quote] ADD CONSTRAINT [FK__Quote__sap_custo__70A8B9AE] FOREIGN KEY ([sap_customer_id]) REFERENCES [dbo].[Customer]([sap_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [FK_region_sales_org_j390d] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[State] ADD CONSTRAINT [FK_state_sales_org_98jd23] FOREIGN KEY ([sales_org_id]) REFERENCES [dbo].[Sales_Org]([sales_org_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
