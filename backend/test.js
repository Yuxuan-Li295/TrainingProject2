const Employee = require('./models/Employee'); // 确保正确引入模型

Employee.find({}, 'onboardingStatus.currentStep')  // 只提取ID（默认包含）和当前步骤
    .then(employees => {
        // 创建一个数组来存储员工ID和当前步骤
        const employeeStatusArray = employees.map(employee => {
            return {
                employeeId: employee._id, // MongoDB默认的ID字段
                currentStep: employee.onboardingStatus.currentStep
            };
        });

        console.log(employeeStatusArray); // 输出数组查看结果
    })
    .catch(err => {
        console.error('Error retrieving employee data:', err);
    });


const userId = "某个特定的用户ID";  // 替换成实际的用户ID

Employee.findOne({ _id: userId }, 'firstName')  // 只查询firstName字段
    .then(employee => {
        if (employee) {
            console.log(`The first name of the employee is ${employee.firstName}`);
        } else {
            console.log('No employee found with the given ID');
        }
    })
    .catch(err => {
        console.error('Error retrieving employee:', err);
    });

Employee.findOneAndUpdate(
    { _id: userId },  // 查询条件，根据_id查找
    { $set: { "onboardingStatus.currentStep": "COMPLETE" } },  // 更新操作
    { new: true }  // 返回更新后的文档
)
    .then(updatedEmployee => {
        if (updatedEmployee) {
            console.log(`Updated employee's current step to: ${updatedEmployee.onboardingStatus.currentStep}`);
        } else {
            console.log('No employee found with the given ID');
        }
    })
    .catch(err => {
        console.error('Error updating employee:', err);
    });