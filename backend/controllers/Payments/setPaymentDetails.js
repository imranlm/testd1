const mongoose = require('mongoose');
const { Payment, Course, Simulator, Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const storePaymentDetails = async (req, res) => {
    try {
        await connectToMongoDB();

        // Extract payment details from req.body
        const {
            courseName,
            email,
            price,
            paidStatus,
            paymentType,
            dateTime
        } = req.body;

        // Parse price to Decimal128
        const parsedPrice = mongoose.Types.Decimal128.fromString(price.replace(/[^0-9.]/g, ''));

        let courseIdArray = [];
        let durationArray = [];
        let expiryDateArray = [];
        let type = '';

        for (const title of courseName) {
            let course = await Course.findOne({ title }).lean();
            if (course) {
                courseIdArray.push({ course: title, id: course._id, type: 'course' }); // Include `course` property
                durationArray.push({ course: title, duration: course.duration, type: 'course' });
                expiryDateArray.push({ course: title, date: calculateExpiryDate(course.duration), type: 'course' });
            } else {
                let simulator = await Simulator.findOne({ title }).lean();
                if (simulator) {
                    courseIdArray.push({ course: title, id: simulator._id, type: 'simulator' }); // Include `course` property
                    durationArray.push({ course: title, duration: simulator.duration, type: 'simulator' });
                    expiryDateArray.push({ course: title, date: calculateExpiryDate(simulator.duration), type: 'simulator' });
                } else {
                    return res.status(404).json({ message: `Course or Simulator with title ${title} not found` });
                }
            }
        }
        
        // Save payment details
        const payment = new Payment({
            courseName: courseName.map(title => {
                const courseInfo = courseIdArray.find(c => c.course === title);
        
                if (!courseInfo) {
                    throw new Error(`Course with title "${title}" not found in courseIdArray`);
                }
        
                return {
                    title,
                    type: courseInfo.type
                };
            }),
            email,
            price: parsedPrice,
            paidStatus,
            dateTime: new Date(dateTime),
            paymentType,
            duration: durationArray,
            courseId: courseIdArray,
            expiryDate: expiryDateArray
        });
        
        await payment.save();
        
        

        // Update the student's collection
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(200).json({ message: 'Student not found' });
        }

        for (let i = 0; i < courseIdArray.length; i++) {
            const courseIdInfo = courseIdArray[i];
            const title = courseName[i];
            const expiryDate = expiryDateArray[i].date;
            const duration = durationArray[i].duration;
        
            if (courseIdInfo.type === 'course') {
                // Check if the course is already enrolled
                const isCourseEnrolled = student.coursesEnrolled.some(
                    (enrolledCourse) => enrolledCourse.courseId.toString() === courseIdInfo.id.toString()
                );
        
                if (!isCourseEnrolled) {
                    student.coursesEnrolled.push({
                        courseId: courseIdInfo.id,
                        manualCourseId: title,
                        progress: 0,
                        startDate: new Date(),
                        endDate: expiryDate
                    });
                }
            } else if (courseIdInfo.type === 'simulator') {
                // Check if the simulator is already purchased
                const isSimulatorPurchased = student.simulatorsPurchased.some(
                    (purchasedSimulator) => purchasedSimulator.simulatorId.toString() === courseIdInfo.id.toString()
                );
        
                if (!isSimulatorPurchased) {
                    student.simulatorsPurchased.push({
                        simulatorId: courseIdInfo.id,
                        manualSimulatorId: title,
                        startDate: new Date(),
                        endDate: expiryDate,
                        modules: [] // Initialize with any default values if needed
                    });
                }
            }
        }
        
        // Save the updated student document
        await student.save();

        res.status(201).json({ message: 'Payment details stored and student record updated successfully', payment });
    } catch (error) {
        console.error('Error storing payment details and updating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper function to calculate expiry date based on duration
const calculateExpiryDate = (duration) => {
    // Normalize the duration string to handle variations in spacing and pluralization
    const normalizedDuration = duration.toLowerCase().replace(/\s+/g, '');
    const match = normalizedDuration.match(/^(\d+)(day|month|year)s?$/);

    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const [ , value, unit ] = match;
    const numValue = parseInt(value, 10);
    const now = new Date();

    switch (unit) {
        case 'day':
            now.setDate(now.getDate() + numValue);
            break;
        case 'month':
            now.setMonth(now.getMonth() + numValue);
            break;
        case 'year':
            now.setFullYear(now.getFullYear() + numValue);
            break;
        default:
            throw new Error(`Unknown time unit: ${unit}`);
    }

    return now;
};


module.exports = { storePaymentDetails };
