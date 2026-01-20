import { defineType } from "sanity";

export default defineType({
  name: "ourServices",
  title: "Our Services Page",
  type: "document",
  fields: [
    {
      name: "sectionTitle",
      type: "string",
      title: "Section Title",
      description: "Static title (used if rotatingText is empty)",
    },
    {
      name: "rotatingText",
      type: "array",
      title: "Rotating Text",
      description: "Array of text strings that will rotate in the title. Leave empty to use static sectionTitle.",
      of: [{ type: "string" }],
    },
    {
      name: "descriptionText",
      type: "text",
      title: "Description Text",
    },
    {
      name: "servicesInfo",
      title: "Service Info Boxes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              description: "Preview text shown in the service box (truncated to 2 lines)",
            },
            {
              name: "backgroundType",
              type: "string",
              title: "Background Type",
              description: "Choose how to style this service box background",
              options: {
                list: [
                  { title: "Color", value: "color" },
                  { title: "Image", value: "image" },
                ],
                layout: "radio",
              },
              initialValue: "image",
            },
            {
              name: "backgroundColor",
              type: "string",
              title: "Background Color",
              description: "Choose a background color for this service box",
              hidden: ({ parent }) => parent?.backgroundType !== "color",
              options: {
                list: [
                  { title: "Black", value: "#000000" },
                  { title: "Dark Gray", value: "#1a1a1a" },
                  { title: "Medium Gray", value: "#4a4a4a" },
                  { title: "Light Gray", value: "#d1d5db" },
                  { title: "White", value: "#ffffff" },
                  { title: "US Blue (Logo)", value: "#0028B8" },
                  { title: "US Red (Logo)", value: "#D14124" },
                  { title: "Navy Blue", value: "#1e3a8a" },
                  { title: "Sky Blue", value: "#0ea5e9" },
                  { title: "Dark Green", value: "#065f46" },
                  { title: "Emerald", value: "#10b981" },
                  { title: "Dark Red", value: "#7f1d1d" },
                  { title: "Red", value: "#ef4444" },
                  { title: "Orange", value: "#f97316" },
                  { title: "Amber", value: "#f59e0b" },
                  { title: "Transparent", value: "transparent" },
                ],
                layout: "dropdown",
              },
            },
            {
              name: "backgroundImage",
              type: "image",
              title: "Box Background Image",
              description: "Background image displayed behind this service box",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.backgroundType !== "image",
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                },
              ],
            },
            {
              name: "textColor",
              type: "string",
              title: "Text Color",
              description: "Choose the color for title and description text",
              options: {
                list: [
                  { title: "White", value: "#ffffff" },
                  { title: "Light Gray", value: "#d1d5db" },
                  { title: "Medium Gray", value: "#9ca3af" },
                  { title: "Dark Gray", value: "#4b5563" },
                  { title: "Black", value: "#000000" },
                  { title: "Sky Blue", value: "#0ea5e9" },
                  { title: "Emerald", value: "#10b981" },
                  { title: "Amber", value: "#f59e0b" },
                  { title: "Red", value: "#ef4444" },
                ],
                layout: "dropdown",
              },
              initialValue: "#ffffff",
            },
            {
              name: "slug",
              type: "slug",
              title: "URL Slug",
              description: "URL-friendly identifier for this service (e.g., 'plumbing-services')",
              options: {
                source: "title",
                maxLength: 96,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "fullDescription",
              type: "array",
              title: "Full Description",
              description: "Rich text content displayed on the service detail page",
              of: [
                {
                  type: "block",
                },
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative Text",
                    },
                  ],
                },
              ],
            },
            {
              name: "images",
              type: "array",
              title: "Images",
              description: "Additional images for the service detail page",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative Text",
                    },
                    {
                      name: "caption",
                      type: "string",
                      title: "Caption",
                    },
                  ],
                },
              ],
            },
            {
              name: "features",
              type: "array",
              title: "Features",
              description: "List of key features or benefits for this service",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "title",
                      type: "string",
                      title: "Feature Title",
                    },
                    {
                      name: "description",
                      type: "text",
                      title: "Feature Description",
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
    },
    {
      name: "deliveryMethodsHeading",
      type: "string",
      title: "Delivery Methods Heading",
      description: "Title shown above the delivery methods slice (e.g., 'Delivery Methods').",
    },
    {
      name: "deliveryMethodsIntro",
      type: "text",
      rows: 3,
      title: "Delivery Methods Intro",
      description: "Short supporting copy that sets context for how you deliver projects.",
    },
    {
      name: "deliveryMethodsFormHeadline",
      type: "string",
      title: "Quote Form Headline",
      description: "Optional headline shown when a delivery method expands (e.g., 'Request a Quote').",
    },
    {
      name: "deliveryMethodsFormCopy",
      type: "text",
      rows: 3,
      title: "Quote Form Supporting Copy",
      description: "Short blurb that appears above the form in the expanded state.",
    },
    {
      name: "deliveryMethodsEmail",
      type: "string",
      title: "Quote Request Email",
      description: "Email to receive Delivery Method quote requests (fallback is info@usmechanicalllc.com).",
    },
    {
      name: "deliveryMethodsAccent",
      type: "string",
      title: "Accent Label",
      description: "Optional short label that appears above the heading (e.g., 'Project Delivery').",
    },
    {
      name: "deliveryMethodsBoxTitle",
      type: "string",
      title: "Delivery Methods Box Title",
      description: "Large heading displayed at the top of the delivery methods box (e.g., 'Delivery method?')",
      placeholder: "Delivery method?",
    },
    {
      name: "deliveryMethods",
      title: "Delivery Methods",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Method Title",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "summary",
              type: "text",
              rows: 3,
              title: "Method Summary",
              description: "Concise, energetic description that sells the approach.",
            },
            {
              name: "body",
              type: "array",
              title: "Method Body",
              description: "Optional richer copy. Keep it tight—first block is shown in the card.",
              of: [
                { type: "block" },
                { type: "image", options: { hotspot: true } },
              ],
            },
            {
              name: "backgroundImage",
              type: "image",
              title: "Background Image",
              description: "Optional background for this delivery method card",
              options: { hotspot: true },
              fields: [
                { name: "alt", type: "string", title: "Alt text" },
              ],
            },
            {
              name: "badge",
              type: "string",
              title: "Badge Text",
              description: "Short punchy tag (e.g., 'Fast', 'Collaborative').",
            },
            {
              name: "badgeTone",
              type: "string",
              title: "Badge Tone",
              description: "Sets badge color accent.",
              options: {
                list: [
                  { title: "Sky", value: "sky" },
                  { title: "Amber", value: "amber" },
                  { title: "Emerald", value: "emerald" },
                  { title: "Pink", value: "pink" },
                  { title: "Slate", value: "slate" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
            },
            {
              name: "ctaLabel",
              type: "string",
              title: "CTA Label",
              description: "Optional call-to-action label (e.g., 'See how it works').",
            },
            {
              name: "ctaUrl",
              type: "url",
              title: "CTA URL",
              description: "External link for the CTA (or use a deep link).",
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "summary",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Untitled method",
                subtitle: subtitle
                  ? `${subtitle.substring(0, 80)}${subtitle.length > 80 ? "..." : ""}`
                  : "No summary yet",
              };
            },
          },
        },
      ],
    },
  ],
});
