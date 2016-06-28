//*Developer Name [Textbox]
//Developer Address [Text boxes for Street 1, Street 2, City, *Zip; Dropdown for State]
//*Developer Email Address [Textbox]
//Developer Phone [Textbox]
//*Commercial/Non-commercial [Dropdown]
//*Energy Type: [Listbox with the following options: wind / solar / hyrdo / geo - thermal / biomass / landfill gas/other (with textbox)].
//Availability: [Listbox of States]
//Certifications: [Textbox]
//MD Approval Number: [Textbox]
//About Us: [Textbox]
var mongoose = require('mongoose');


var DeveloperSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    //firstName: String, -- get this from user
    //lastName: String, -- get this from user
    altEmail: String, // allow for use if different from user email 
    altPhone: String, // for for use if different from suer phone
    isCommercial: Boolean,
    energyType: [{ type:String, enum:['wind','solar','hyrdo' , 'geo-thermal' , 'biomass' , 'landfill gas', 'other']}],
    energyOther: String,
    availability: String, // need to add reference to a type of State
    certifications: String,
    mdApprovalNumber: String,
    aboutUs: String 
});

module.exports = mongoose.model('Developer', DeveloperSchema);
