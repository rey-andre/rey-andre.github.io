$(document).ready(function() {
    const now = new Date();
    $(document).on("click", "#portfolio", function () {
      // Data JSON yang diberikan
      const jsonData = {
        "respCode": "200",
        "status": "success",
        "message": "Data retrieved successfully",
        "time": now,
        "data": [
          {
            "title": "Card Profile",
            "description": "Card Profile is a component that displays user profile information in card form.This card can be used to display photos, names, and user contact information.This card can also be used to display additional information such as address, telephone number, and user social media.",
            "image": "-"
          },
          {
            "title": "Employee Self Service Web App",
            "description": "Employee Self Service Web App is a web application that allows employees to access their personal information, such as salaries, leave, and benefits.This application also allows employees to apply for leave, change personal information, and access important documents.This application is designed to improve employee efficiency and productivity.",
            "image": "-"
          },
          {
            "title": "Employee Self Service Mobile App",
            "description": "Employee Self Service Mobile App is a mobile application that allows employees to access their personal information, such as salaries, leave, and benefits.This application also allows employees to apply for leave, change personal information, and access important documents.This application is designed to improve employee efficiency and productivity.",
            "image": "-"
          },
          {
            "title": "Anti Money Laundering and Countering the Financing of Terrorism (AML-CFT) Web App",
            "description": "AML-CFT is an application used by banks to report all large or suspicious transactions in order to prevent money laundering and distribution of terrorist/crime funds.",
            "image": "-"
          }
        ]
      };
  
      // Menampilkan data JSON ke dalam textarea
      $("#jsonData").val(JSON.stringify(jsonData, null, 2)); // Memformat JSON dengan indentation
      $("#modalPortfolio").modal("show"); // Menampilkan modal
    });
  });
  