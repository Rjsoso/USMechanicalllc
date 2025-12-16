export default {
  name: "ourServices",
  title: "Our Services Page",
  type: "document",
  fields: [
    {
      name: "sectionTitle",
      type: "string",
      title: "Section Title",
    },
    {
      name: "descriptionText",
      type: "text",
      title: "Description Text",
    },
    {
      name: "servicesInfo",
      type: "array",
      title: "Service Info Boxes",
      description: "Add service boxes that appear on the left side of the services section. Each box can have a title and description.",
      of: [
        {
          type: "object",
          fields: [
            { 
              name: "title", 
              type: "string", 
              title: "Service Title",
              description: "The title displayed on the service info box",
              validation: (Rule) => Rule.required().error("Title is required")
            },
            { 
              name: "description", 
              type: "text", 
              title: "Service Description",
              description: "A preview of this description will appear below the title on the service box. Click the box to see the full description in a modal. This text will be truncated to 2 lines with a faded appearance.",
              rows: 4,
              placeholder: "Enter a description for this service. This will appear as a preview below the title."
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Untitled Service",
                subtitle: subtitle ? `${subtitle.substring(0, 60)}${subtitle.length > 60 ? "..." : ""}` : "No description",
              };
            },
          },
        },
      ],
    },
    {
      name: "services",
      type: "array",
      title: "CardSwap Images",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description" },
            { name: "image", type: "image", title: "Card Image" },
          ],
        },
      ],
    },
  ],
};

