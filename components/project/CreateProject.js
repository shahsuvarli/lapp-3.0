"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import moment from "moment";
import axios from "axios";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";

export default function CreateProject({
  sales_org,
  vertical_market,
  channel,
  region,
  state,
}) {
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const saveProject = async (values) => {
    try {
      const {
        data: { message },
      } = await axios.post("/api/project/create", {
        values,
        user_id: session?.user.id,
      });
      enqueueSnackbar(message, { variant: "success" });
      router.push("/projects/list");
    } catch (error) {
      enqueueSnackbar("Failed to create the project", { variant: "error" });
    }
  };

  return (
    <div className="flex flex-col px-8 py-4 gap-8 bg-[#f7f6f3] rounded-lg box-border animate-[rise_1s_ease-in-out] w-full">
      <p className="text-2xl">Create a new project</p>
      <Formik
        initialValues={{
          sales_org_id: "",
          project_name: "",
          ranking: "",
          general_contractor: "",
          electrical_contractor: "",
          state: "",
          region: "",
          vertical_market: "",
          status: "Open",
          won_lost: "Pending",
          channel: 1001,
          created_date: moment().format("YYYY-MM-DD"),
          notes: "",
          created_by: "",
          modified_by: "",
          modified_date: "",
        }}
        validationSchema={Yup.object({
          created_date: Yup.date().required("Please select date"),
          project_name: Yup.string().required("Please enter value"),
          vertical_market: Yup.string().required("Please select option"),
          region: Yup.string().required("Please select option"),
          sales_org_id: Yup.string().required("Please select option"),
          state: Yup.string().required("Please select option"),
          channel: Yup.string().required("Please select option"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setIsDisabled(true);
          const newValues = {
            ...values,
            channel: Number(values.channel),
            ranking: Number(values.ranking) || null,
            region: Number(values.region),
            sales_org_id: Number(values.sales_org_id),
            vertical_market: Number(values.vertical_market),
            state: Number(values.state),
            general_contractor: values.general_contractor || null,
            electrical_contractor: values.electrical_contractor || null,
            notes: values.notes || null,
          };
          setTimeout(() => {
            saveProject(newValues);
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, resetForm, setFieldValue, errors }) => (
          <Form className="w-full flex flex-col justify-center">
            <div className="w-full h-full gap-x-0 gap-y-6 flex flex-wrap justify-between [&>*]:gap-2 [&>*]:flex [&>*]:flex-col [&>*]:text-sm text-[#313131] [&>*]:w-[32%] [&>*]:relative [&>div>input]:h-10 [&>div>input]:p-2 [&>div>input]:box-border [&>div>input]:rounded-md [&>div>input]:border [&>div>input]:border-solid [&>div>input]:border-[#d9d9d9] [&>div>select]:h-10 [&>div>select]:p-2 [&>div>select]:box-border [&>div>select]:rounded-md [&>div>select]:border [&>div>select]:border-solid [&>div>select]:border-[#d9d9d9]">
              <div>
                <label htmlFor="sales_org_id">Sales organization</label>
                <Field
                  name="sales_org_id"
                  className={`border border-solid ${
                    errors.sales_org_id
                      ? "!border-red-600"
                      : "!border-[#e0dbd4]"
                  }`}
                  type="select"
                  as="select"
                  value={values.sales_org_id}
                  id="sales_org_id"
                  placeholder="Enter Sales Organization"
                  onChange={async (e) => {
                    setFieldValue("sales_org_id", e.target.value);
                    const newStates = state.filter(
                      (item) => item.sales_org_id == e.target.value
                    );
                    const newRegions = region.filter(
                      (region) => region.sales_org_id == e.target.value
                    );
                    setStates(newStates);
                    setRegions(newRegions);
                  }}
                >
                  <option value="">Select Sales Organization</option>
                  {sales_org.map((sales_org) => (
                    <option
                      value={sales_org.sales_org_id}
                      key={sales_org.sales_org_id}
                    >
                      {sales_org.sales_org_id} - {sales_org.sales_org}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="project_name">Project Name</label>
                <Field
                  name="project_name"
                  type="text"
                  className={`border border-solid ${
                    errors.project_name
                      ? "!border-red-600"
                      : "!border-[#e0dbd4]"
                  }`}
                  id="project_name"
                  placeholder="Enter Project Name"
                />
              </div>
              <div>
                <label htmlFor="ranking">Ranking</label>
                <Field name="ranking" type="select" as="select" id="ranking">
                  <option value="">Select Ranking</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Field>
              </div>
              <div>
                <label htmlFor="general_contractor">General Contractor</label>
                <Field
                  name="general_contractor"
                  type="text"
                  id="general_contractor"
                  placeholder="Enter General Contractor"
                />
              </div>
              <div>
                <label htmlFor="electrical_contractor">
                  Electrical Contractor
                </label>
                <Field
                  name="electrical_contractor"
                  type="text"
                  id="electrical_contractor"
                  placeholder="Enter Electrical Contractor"
                />
              </div>
              <div>
                <label htmlFor="state">State</label>
                <Field
                  name="state"
                  type="select"
                  as="select"
                  className={`border border-solid ${
                    errors.state ? "!border-red-600" : "!border-[#e0dbd4]"
                  }`}
                  id="state"
                  placeholder="Select State"
                >
                  <option value="">Select State</option>
                  {states.map((item) => {
                    return (
                      <option
                        key={item.state_id}
                        value={item.state_id}
                        id="state"
                      >
                        {item.state_long_name}
                      </option>
                    );
                  })}
                </Field>
              </div>
              <div>
                <label htmlFor="created_date">Created Date</label>
                <Field
                  name="created_date"
                  type="date"
                  placeholder="Enter Created Date"
                  id="created_date"
                  className={`border border-solid ${
                    errors.created_date
                      ? "!border-red-600"
                      : "!border-[#e0dbd4]"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="region">Region</label>
                <Field
                  name="region"
                  type="select"
                  as="select"
                  className={`border border-solid ${
                    errors.region ? "!border-red-600" : "!border-[#e0dbd4]"
                  }`}
                  id="region"
                  placeholder="Select Region"
                  autoComplete="off"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.region_id} value={region.region_id}>
                      {region.region_name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="vertical_market">Vertical Market</label>
                <Field
                  name="vertical_market"
                  type="select"
                  as="select"
                  id="vertical_market"
                  placeholder="Select Vertical Market"
                  className={`border border-solid ${
                    errors.vertical_market
                      ? "!border-red-600"
                      : "!border-[#e0dbd4]"
                  }`}
                >
                  <option value="">Select Market</option>
                  {vertical_market.map((ver) => (
                    <option
                      value={ver.vertical_market_id}
                      key={ver.vertical_market_name}
                    >
                      {ver.vertical_market_id} - {ver.vertical_market_name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="channel">Channel (direct/dist)</label>
                <Field
                  name="channel"
                  type="select"
                  as="select"
                  id="channel"
                  placeholder="Select Channel"
                >
                  {channel.map((chan) => (
                    <option value={chan.channel_id} key={chan.channel_name}>
                      {chan.channel_name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="status">Status</label>
                <Field
                  name="status"
                  type="select"
                  id="status"
                  as="select"
                  placeholder="Select Status"
                >
                  <option value={"Open"}>Open</option>
                  <option value={"Closed"}>Closed</option>
                </Field>
              </div>
              <div>
                <label htmlFor="won_lost">Won / Lost</label>
                <Field
                  name="won_lost"
                  type="select"
                  id="won_lost"
                  as="select"
                  placeholder="Select Won / Lost"
                >
                  <option value={"Pending"}>Pending</option>
                  <option value={"Won"}>Won</option>
                  <option value={"Lost"}>Lost</option>
                </Field>
              </div>
              <div className="w-[200px]">
                <label htmlFor="notes">Notes</label>
                <Field
                  className="h-16 border border-solid border-[#d9d9d9] p-2 rounded-md"
                  name="notes"
                  id="notes"
                  type="textarea"
                  placeholder="Enter Notes"
                  rows="4"
                  component="textarea"
                />
              </div>
            </div>
            <div className="flex text text-sm gap-5 self-end mt-2.5 [&>button]:w-36 [&>button]:h-10 [&>button]:rounded-md border-none hover:cursor-pointer">
              <button
                className="bg-[#e4e2dd] text-[#313131]"
                type="cancel"
                onClick={resetForm}
                disabled={isDisabled}
              >
                Reset
              </button>
              <button
                className="bg-[#e7914e] text-white"
                type="submit"
                disabled={isDisabled}
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
