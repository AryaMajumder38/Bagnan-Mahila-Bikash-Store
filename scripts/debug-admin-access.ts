import { getPayload } from 'payload';
import config from '@payload-config';

// This script is for debugging admin access issues
async function checkAdminAccess() {
  console.log('Initializing Payload...');
  const payload = await getPayload({
    config,
  });
  
  try {
    console.log('Checking for super-admin users...');
    
    const adminUsers = await payload.find({
      collection: 'users',
      where: {
        roles: {
          contains: 'super-admin',
        },
      },
      depth: 0,
    });
    
    console.log(`Found ${adminUsers.docs.length} admin users:`);
    adminUsers.docs.forEach((user: any, index: number) => {
      console.log(`[${index + 1}] Email: ${user.email}, Username: ${user.username}`);
      console.log(`    ID: ${user.id}`);
      console.log(`    Roles: ${user.roles?.join(', ') || 'None'}`);
      console.log('---');
    });
    
    console.log('\nChecking Payload authentication system...');
    console.log('Admin dashboard should be accessible at: /admin');
    console.log('Make sure you are logged in with an admin account before visiting the admin URL.');
    
  } catch (error) {
    console.error('Error checking admin access:', error);
  } finally {
    // No need to disconnect in this case
    process.exit(0);
  }
}

checkAdminAccess();
