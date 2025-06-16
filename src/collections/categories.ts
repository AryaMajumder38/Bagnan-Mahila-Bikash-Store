import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
    slug: 'categories',
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name:"slug",
            type: "text",
            required: true,
            unique: true,
            index: true,    
        },
        {
            name:"color",
            type: "text",
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
        // {
        //     name: 'image',
        //     type: 'upload',
        //     relationTo: 'media',
        //     required: false,
        // },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: false,
            
        },

        {
            name:"subcategories",
            type: "join",
            collection: "categories",
            on:"parent",
            hasMany: true,
        }
        
    ],
};


