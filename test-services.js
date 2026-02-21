import { authService } from './src/services/authService.js';
import { cvService } from './src/services/cvService.js';
import { blogService } from './src/services/blogService.js';

async function testServices() {
    console.log("1. Testing CV Service (Public Data)");
    const cvData = await cvService.getCv();
    console.log("   CV Title:", cvData.personal.title);

    console.log("\n2. Testing Blog Service (Public Data)");
    const blogs = await blogService.getAllBlogs();
    console.log("   Blog count:", blogs.length);

    console.log("\n3. Testing Auth Service (Login)");
    const loggedIn = await authService.login('admin', 'password123');
    console.log("   Logged in successfully?", loggedIn);

    if (loggedIn) {
        console.log("\n4. Testing Authorized CV Update");
        cvData.summary = "Updated summary via Frontend Service Layer test!";
        const updatedCv = await cvService.updateCv(cvData);
        console.log("   Updated CV Summary:", updatedCv.summary);

        console.log("\n5. Testing Authorized Blog Creation");
        const newBlog = await blogService.createBlog({ title: "First Blog", content: "Hello World!" });
        console.log("   Created Blog ID:", newBlog.id);

        console.log("\n6. Testing Auth Logout");
        authService.logout();

        try {
            console.log("\n7. Verifying protection (creating blog after logout)...");
            await blogService.createBlog({ title: "Second Blog", content: "This should fail" });
        } catch (e) {
            console.log("   Successfully blocked unauthorized request.");
        }
    }
}

testServices();
