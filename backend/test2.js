async function displayDocuments(employeeId, documentType) {
    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            console.log('Employee not found');
            return;
        }

        if (!employee.documents[documentType]) {
            console.log('Document type not found');
            return;
        }

        const documents = employee.documents[documentType];

        documents.forEach((document, index) => {
            console.log(`URL: ${document.documentURL}`);
        });

    } catch (error) {
        console.error(error);
    }
}

displayDocuments('employeeId_here', 'RECEIPT');
