# Portfolio Management Guide

## Overview
The portfolio section allows you to organize projects by building types (categories) and display multiple completed jobs within each category. Users can click on a category to see all projects in that category, then click on individual projects to view detailed information and photos.

## Structure
- **Categories**: Types of buildings or projects (e.g., "Office Buildings", "Hospitals", "Schools")
- **Projects**: Individual completed jobs that belong to a category

## How to Use in Sanity

### Step 1: Create a Category
1. Go to **Content** → **6. Portfolio** → **Categories**
2. Click **Create new**
3. Fill in:
   - **Category Title**: e.g., "Office Buildings", "Hospitals", "Schools"
   - **Category Description**: Brief description of what types of projects are in this category
   - **Category Image**: Upload a featured image for the category card
   - **Display Order**: Lower numbers appear first (0 is default)
   - **Projects**: Leave empty for now - you'll add projects after creating them

### Step 2: Create Projects
1. Go to **Content** → **6. Portfolio** → **Projects**
2. Click **Create new**
3. Fill in:
   - **Project Title**: Name of the project (required)
   - **Project Description**: Detailed description of the work done
   - **Project Images**: Upload multiple photos (at least 1 required)
     - For each image, add:
       - **Alternative Text**: Describe the image (required for accessibility)
       - **Caption**: Optional caption
   - **Category**: Select which category this project belongs to (required)
   - **Location**: e.g., "Salt Lake City, UT"
   - **Year Completed**: e.g., "2023"
   - **Display Order**: Order within the category (0 is default)
   - **Client Name**: Optional
   - **Project Type**: Optional (e.g., "New Construction", "Renovation")

### Step 3: Add Projects to Category
1. Go back to your Category
2. In the **Projects in this Category** field, click **Add item**
3. Select the projects you created
4. Projects will automatically be sorted by their Display Order

## Tips
- **Display Order**: Use 0, 1, 2, 3... to control the order. Lower numbers appear first.
- **Images**: Upload high-quality photos. The first image will be used as the thumbnail.
- **Descriptions**: Write detailed descriptions - they appear in the project modal when users click on a project.
- **Categories**: Create meaningful categories that group similar types of buildings or projects together.

## User Experience
1. Users see a grid of category cards on the Portfolio page
2. Clicking a category shows all projects in that category
3. Clicking a project opens a modal with:
   - Image gallery (can navigate through multiple images)
   - Full project description
   - Location, year, client, and project type details
4. Users can navigate back to categories or close the modal

## Example Workflow
1. Create category: "Office Buildings"
2. Create 3 projects:
   - "Downtown Corporate Center" → Assign to "Office Buildings"
   - "Tech Campus Expansion" → Assign to "Office Buildings"
   - "Medical Office Complex" → Assign to "Office Buildings"
3. Go back to "Office Buildings" category and add all 3 projects
4. Users will see "Office Buildings" card, click it, then see all 3 projects

