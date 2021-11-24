const Person = require('../model/model');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');


exports.getall = async(req, res) =>{
    importExcelData2MongoDB(process.cwd() + '/public/uploads/' + req.file.filename );
    res.render('success');
}


async function importExcelData2MongoDB  (filePath){
    
    console.log(filePath);
    let excelData;
    try {
        excelData = await excelToJson({
            sourceFile:filePath,
            sheets:[{
                name: 'Sheet1',
    
                header:{
                    rows: 1
                },
                columnToKey: {
                    A: 'nameOfCandidate',
                    B: 'email',
                    C: 'mobile',
                    D: 'dob',
                    E: 'workExperience',
                    F: 'resumeTitle',
                    G: 'currentLocation',
                    H: 'postalAddress',
                    I: 'currentEmployer',
                    J: 'currentDesignation'
                }
            }]
        });
        
    } catch (error) {
        console.log(error);
    }
    
    console.log(excelData);

    const dataToInsert = excelData['Sheet1'];
    try {
        await dataToInsert.forEach(async (row)=>{
            const newPerson = new Person(row);
            await newPerson.save((err,data)=>{
                if(err){
                    // console.log(err);
                    if(err.name === 'ValidationError') 
                    console.log("validation error");
                    else if(err.code && err.code == 11000)
                    console.log("duplicate key error");
                    else
                    console.log("internal server error");
                }
            });
        })
    } catch (error) {
        
    }
    fs.unlinkSync(filePath);

}