import { getPayload } from 'payload';
import config from '../src/payload.config';

/**
 * This script adds the super-admin role to a specified user.
 * Run it with: 
 *   npx ts-node scripts/make-user-admin.ts [email]
 * 
 * Example:
 *   npx ts-node scripts/make-user-admin.ts admin@example.com
 */

async function main() {
  try {
    // Get the email from command line arguments
    const email = process.argv[2];
    
    if (!email) {
      console.error('Error: Email is required.');
      console.error('Usage: npx ts-node scripts/make-user-admin.ts [email]');
      process.exit(1);
    }

    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    });
    
    if (users.docs.length === 0) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    
    const user = users.docs[0];
    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    
    // Check if user already has the super-admin role
    const currentRoles = user.roles || [];
    if (currentRoles.includes('super-admin')) {
      console.log(`User ${email} already has the super-admin role.`);
      process.exit(0);
    }
    
    // Add the super-admin role
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        roles: [...currentRoles, 'super-admin'],
      },
    });
    
    console.log(`Successfully added super-admin role to user ${email}.`);
    console.log('Updated roles:', updatedUser.roles);
    
    await payload.destroy();
  } catch (error) {
    console.error('Error updating user role:', error);
    process.exit(1);
  }
}

main();
