const { Course } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
		
		const data = {
			id: 1,
			name: "Ali Ahmad",
			email: "abc.def@example.com",
			role: "admin"
		};
		res.status(200).json(data);		
		

        // // Connect to MongoDB
        // await connectToMongoDB();

        // // Fetch all courses from the database
        // const courses = await Course.find().lean();

        // // If no courses found, return an empty array
        // if (!courses || courses.length === 0) {
            // return res.status(200).json({ courses: [] });
        // }

        // // Map the courses to include only necessary fields
        // const courseDetails = courses.map(course => ({
            // courseId: course.courseId,
            // title: course.title,
            // description: course.description,
            // price: course.price,
            // mode: course.mode,
            // duration: course.duration,
            // id:course._id,
            // img: course.img ? {
                // data: course.img.data.toString('base64'),
                // contentType: course.img.contentType
            // } : null
        // }));

        // // Return the courses in the response
        // res.status(200).json({ courses: courseDetails });
		
		
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllCourses };
