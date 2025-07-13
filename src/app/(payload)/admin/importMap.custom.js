// Custom import map with explicit imports
import { TenantField } from '@payloadcms/plugin-multi-tenant/client';
import { WatchTenantCollection } from '@payloadcms/plugin-multi-tenant/client';
import { TenantSelector } from '@payloadcms/plugin-multi-tenant/client';
import { TenantSelectionProvider } from '@payloadcms/plugin-multi-tenant/rsc';

export const customImportMap = {
  "@payloadcms/plugin-multi-tenant/client#TenantField": TenantField,
  "@payloadcms/plugin-multi-tenant/client#WatchTenantCollection": WatchTenantCollection,
  "@payloadcms/plugin-multi-tenant/client#TenantSelector": TenantSelector,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider": TenantSelectionProvider
};
