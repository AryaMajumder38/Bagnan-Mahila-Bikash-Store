import { getPayload } from "payload"
import config from "@payload-config"

const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Category1",
    slug: "category1",
    color: "#FF6B6B", // red
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category2",
    slug: "category2",
    color: "#FFD93D", // yellow
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category3",
    slug: "category3",
    color: "#6BCB77", // green
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category4",
    slug: "category4",
    color: "#4D96FF", // blue
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category5",
    slug: "category5",
    color: "#A66DD4", // purple
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category6",
    slug: "category6",
    color: "#F28F3B", // orange
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category7",
    slug: "category7",
    color: "#3CBBB1", // teal
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category8",
    slug: "category8",
    color: "#FF7F50", // coral
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category9",
    slug: "category9",
    color: "#B0A8B9", // lavender gray
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
  {
    name: "Category10",
    slug: "category10",
    color: "#FFD6E0", // light pink
    subcategories: [
      { name: "SubCategory1", slug: "subcategory1" },
      { name: "SubCategory2", slug: "subcategory2" },
      { name: "SubCategory3", slug: "subcategory3" },
      { name: "SubCategory4", slug: "subcategory4" },
      { name: "SubCategory5", slug: "subcategory5" },
    ],
  },
]

const seed = async () => {
  const payload = await getPayload({ config })


  // First check if admin tenant already exists
  const existingTenants = await payload.find({
    collection: "tenants",
    where: {
      slug: { equals: "admin" },
    },
  });
  
  let adminTenant;
  
  if (existingTenants.docs.length > 0) {
    console.log("✅ Admin tenant already exists, using existing tenant");
    adminTenant = existingTenants.docs[0];
  } else {
    try {
      // Create tenant with the correct field names from your schema
      adminTenant = await payload.create({
        collection: "tenants",
        data: {
          tenantname: "admin", // Use the field name from your Tenants schema
          slug: "admin",
          email: "admin-tenant@demo.com", // Add email field required for auth
          password: "demo", // Add password for auth
        },
      });
      console.log("✅ Admin tenant created successfully");
    } catch (error) {
      console.error("❌ Failed to create admin tenant:", JSON.stringify(error, null, 2));
      throw error; // Stop execution if tenant creation fails
    }
  }

  // Check if admin user already exists
  const existingUsers = await payload.find({
    collection: "users",
    where: {
      username: { equals: "admin" },
    },
  });
  
  if (existingUsers.docs.length > 0) {
    console.log("✅ Admin user already exists, using existing user");
  } else {
    try {
      // Create admin user with proper tenant association
      await payload.create({
        collection: "users",
        data: {
          email: "admin@demo.com",
          password: "demo",
          roles: ["super-admin"], // Make sure this role exists in your schema
          username: "admin",
          // Associate the user with the tenant using tenants array
          tenants: [
            {
              tenant: adminTenant.id
            }
          ],
        }
      });
      console.log("✅ Admin user created successfully");
    } catch (error) {
      console.error("❌ Failed to create admin user:", JSON.stringify(error, null, 2));
      // Continue with seeding categories even if user creation fails
    }
  }

  for (const category of categories) {
    try {
      // Check if category already exists
      const existingCategories = await payload.find({
        collection: "categories",
        where: {
          slug: { equals: category.slug },
        },
      });
      
      let createdCategory;
      
      if (existingCategories.docs.length > 0) {
        console.log(`✅ Category ${category.name} already exists, using existing category`);
        createdCategory = existingCategories.docs[0];
      } else {
        createdCategory = await payload.create({
          collection: "categories",
          data: {
            name: category.name,
            slug: category.slug,
            color: category.color,
            parent: null,
          },
        });
        console.log(`✅ Created category ${category.name}`);
      }

      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          try {
            // Create a unique slug for the subcategory
            const subcategorySlug = `${subcategory.slug}-${category.slug}`;
            
            // Check if subcategory already exists
            const existingSubcategories = await payload.find({
              collection: "categories",
              where: {
                slug: { equals: subcategorySlug },
              },
            });
            
            if (existingSubcategories.docs.length > 0) {
              console.log(`✅ Subcategory ${subcategory.name} under ${category.name} already exists`);
            } else {
              await payload.create({
                collection: "categories",
                data: {
                  name: subcategory.name,
                  slug: subcategorySlug, // make slug unique
                  color: category.color,
                  parent: createdCategory.id,
                },
              });
              console.log(`✅ Created subcategory ${subcategory.name} under ${category.name}`);
            }
          } catch (subErr) {
            console.error(
              `❌ Error creating subcategory ${subcategory.name} under ${category.name}:`,
              subErr
            );
          }
        }
      }
    } catch (err) {
      console.error(`❌ Error creating category ${category.name}:`, err);
    }
  }
}

seed()
  .then(() => {
    console.log("✅ Seeding complete.")
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err)
    process.exit(1)
  })
