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

  for (const category of categories) {
    try {
      const createdCategory = await payload.create({
        collection: "categories",
        data: {
          name: category.name,
          slug: category.slug,
          color: category.color,
          parent: null,
        },
      })

      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          try {
            await payload.create({
              collection: "categories",
              data: {
                name: subcategory.name,
                slug: `${subcategory.slug}-${category.slug}`, // make slug unique
                color: category.color,
                parent: createdCategory.id,
              },
            })
          } catch (subErr) {
            console.error(
              `❌ Error creating subcategory ${subcategory.name} under ${category.name}:`,
              subErr
            )
          }
        }
      }
    } catch (err) {
      console.error(`❌ Error creating category ${category.name}:`, err)
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
