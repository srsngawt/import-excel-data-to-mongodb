const Person = require('../model/model');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const async = require('async');


exports.getall = async(req, res) =>{
    await importExcelData2MongoDB(process.cwd() + '/public/uploads/' + req.file.filename );
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
    


    const dataToInsert = excelData['Sheet1'];
    //return console.log(dataToInsert);

    try {
        async.eachSeries(dataToInsert, async function(e, cb) {
            let oldPerson = await Person.findOne({ email: e.email });
            if (oldPerson) {
                console.log("Duplicate Record");
            } else {
                const newPerson = new Person(e);
                // console.log(newPerson);
                await newPerson.save();
            }
            return cb();
        },
        function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Successfully Added");
            }
  
        });

        
    } catch (error) {
        console.log(error);
    }
    fs.unlinkSync(filePath);

}