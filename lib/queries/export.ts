import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

export async function fetchExportUsers({
  exportType,
  page,
  pageSize,
  role,
  search,
}: {
  exportType: 'page' | 'all';
  page: number;
  pageSize: number;
  role?: string;
  search?: string;
}) {
  const params = new URLSearchParams();

  params.append('exportType', exportType);
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  if (role && role !== 'All Roles') params.append('role', role);
  if (search && search.trim().length > 0) params.append('search', search);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/export?${params.toString()}`;

  window.open(url, '_blank');
}
