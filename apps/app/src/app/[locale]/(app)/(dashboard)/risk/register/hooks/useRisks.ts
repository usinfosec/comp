import type { Departments, RiskStatus } from "@bubba/db/types";
import useSWR from "swr";
import { getRisks } from "../actions/getRisks";

const fetchRisks = async (input: {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: RiskStatus | null;
  department?: Departments | null;
  assigneeId?: string | null;
}) => {
  const response = await getRisks(input);

  if (!response) {
    throw new Error("Failed to fetch risks");
  }

  if (response.serverError) {
    throw new Error(response.serverError);
  }

  if (response.validationErrors) {
    throw new Error(
      response.validationErrors._errors?.join(", ") ||
        "Validation error occurred"
    );
  }

  return response.data?.data;
};

export const useRisks = ({
  search = "",
  page = 1,
  pageSize = 10,
  status,
  department,
  assigneeId,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: RiskStatus | null;
  department?: Departments | null;
  assigneeId?: string | null;
}) => {
  const { data, isLoading, error, mutate } = useSWR(
    ["risks", search, page, pageSize, status, department, assigneeId],
    () =>
      fetchRisks({ search, page, pageSize, status, department, assigneeId }),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      revalidateIfStale: true,
    }
  );

  return { data: data || [], isLoading, error, mutate };
};
