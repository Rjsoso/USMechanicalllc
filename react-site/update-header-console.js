// ============================================
// BROWSER CONSOLE SCRIPT - Run this in Admin Panel
// ============================================
// 
// 1. Go to http://localhost:3000/admin
// 2. Open browser console (F12 → Console tab)
// 3. Paste this entire script and press Enter
// ============================================

(async function() {
  try {
    // Import the writeClient (this will work in the admin panel context)
    const { writeClient } = await import('./src/sanityClient.js')
    
    console.log('🔄 Fetching headerSection document...')
    
    // Fetch the headerSection document
    const headerDoc = await writeClient.fetch(`*[_type == "headerSection"][0]`)
    
    if (!headerDoc) {
      console.log('⚠️ No headerSection document found. Creating a new one...')
      
      const newDoc = await writeClient.create({
        _type: 'headerSection',
        _id: 'headerSection-auto',
        navLinks: [
          { label: 'About', href: '#about' },
          { label: 'Projects', href: '#projects' },
          { label: 'Contact', href: '#contact' },
        ],
        buttonText: 'Request a Quote',
        buttonLink: '#contact',
      })
      
      console.log('✅ Created new headerSection with navigation links!')
      console.log('Navigation links:', newDoc.navLinks)
      alert('✅ Header navigation links created successfully!')
      return
    }
    
    console.log('📝 Current navigation links:', headerDoc.navLinks)
    
    // Update the navigation links to match section IDs
    const updatedNavLinks = [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ]
    
    // Update the document
    const updated = await writeClient
      .patch(headerDoc._id)
      .set({ 
        navLinks: updatedNavLinks,
        buttonLink: '#contact' // Also update button link
      })
      .commit()
    
    console.log('✅ Successfully updated headerSection navigation links!')
    console.log('New navigation links:', updated.navLinks)
    alert('✅ Header navigation links updated successfully!\n\nAbout → #about\nProjects → #projects\nContact → #contact')
    
    // Reload the page to see changes
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    
  } catch (error) {
    console.error('❌ Error updating header links:', error)
    alert('❌ Error: ' + error.message)
  }
})()

