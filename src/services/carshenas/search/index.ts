import carshenasService from "@/services";
import type { SearchApiResponse } from "@/types/dto/search";

export const getSearchResultsService = (parameters: string) =>
  carshenasService.get<SearchApiResponse>(`/search/${parameters}`);
