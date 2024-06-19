  
      let hasTodayWorkshops = false;
      let hasTommorowWorkshops = false;
      let hasSpecificDateWorkshops = false;
      $(document).ready(function () {
        const userId = localStorage.getItem("userId");
        console.log(userId); 
        console.log("Document ready. Attempting to fetch workshops.");
        const apiUrl = "https://skoolworkshopapi.azurewebsites.net/workshopcommission/" + userId;
        
        $.get(
          apiUrl,
          function (response) {
            console.log("API response received:", response);
            if (response.status === 200) {
              const result = response.data;
              const todayWorkshopContainer = $("#today-workshop-container");
              const tomorrowWorkshopContainer = $("#tomorrow-workshop-container");
              const specificWorkshopContainer = $("#specific-date-workshop-container");
    
              const currentDate = new Date();
        
              result.forEach((workshop) => {
                const workshopDate = new Date(workshop.Date);
                const workshopStartTime = new Date(`${workshop.Date}T${workshop.StartTime}`);
    
                // Check if the workshop is today
                const isSameDay = 
                  workshopDate.getDate() === currentDate.getDate() &&
                  workshopDate.getMonth() === currentDate.getMonth() &&
                  workshopDate.getFullYear() === currentDate.getFullYear();
                  
                const isTomorrow = 
                  workshopDate.getDate() === currentDate.getDate() + 1 &&
                  workshopDate.getMonth() === currentDate.getMonth() &&
                  workshopDate.getFullYear() === currentDate.getFullYear();
    
                // Check if the workshop start time is later than the current time
                const isAfterCurrentTime = workshopStartTime > currentDate;
    
                const truncatedDate = truncateText(workshop.Date);
                const panelContent = `
                  <div class="panel custom-panel" data-workshop='${JSON.stringify(workshop)}'>
                    <div class="panel-heading ">${workshop.WorkshopName}</div>
                    <div class="panel-body">
                      <img src="${workshop.LinkToPicture}" class="img-responsive" alt="Image" />
                      <p><strong>Categorie:</strong> ${workshop.Category}</p>
                      <p><strong>Datum:</strong> ${formatDate(truncatedDate)}</p>                                            
                      <p><strong>Tijd:</strong> ${workshop.StartTime} - ${workshop.EndTime}</p>
                      </div>
                      </div>
                      `;

                if (isSameDay && isAfterCurrentTime) {
                  todayWorkshopContainer.append(panelContent);
                  hasTodayWorkshops = true;
                } else if (isTomorrow) {
                  tomorrowWorkshopContainer.append(panelContent)
                  hasTommorowWorkshops = true;
                } else if (workshopDate.getDate() > currentDate.getDate()) {
                  specificWorkshopContainer.append(panelContent)
                  hasSpecificDateWorkshops = true;
                }
              });
              if(!hasTodayWorkshops){
                $("#today-workshop-container .no-workshops-placeholder").show();
              }if(!hasTommorowWorkshops){
                $("#tomorrow-workshop-container .no-workshops-placeholder").show();
              } if(!hasSpecificDateWorkshops){
                $("#specific-date-workshop-container .no-workshops-placeholder").show();
              }
            } else {
              console.error("Failed to fetch workshops. Status code:", response.status);
            }
          }
        ).fail(function (jqXHR, textStatus, errorThrown) {
          console.error("Error during API request:", textStatus, errorThrown);
        });
      });
    
      // Function to short date
      function truncateText(text, maxLength = 10) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength);
        }
        return text;
      }
    
      // Modal handling for entire panel click
      $(document).on("click", ".custom-panel", function () {
        const workshop = $(this).data("workshop");
        $("#workshop-name").text(workshop.WorkshopName);
        $("#workshop-details").html(`
          <p><strong>Categorie:</strong> ${workshop.Category}</p>
          <p><strong>Benodigdheden:</strong> ${workshop.Requirements}</p>
          <p><strong>Opdracht:</strong> ${workshop.CommissionName}</p>
          <p><strong>Starttijd:</strong> ${workshop.StartTime}</p>
          <p><strong>Eindtijd:</strong> ${workshop.EndTime}</p>
          <p><strong>Datum:</strong> ${formatDate(workshop.Date)}</p>
          <p><strong>Locatie:</strong> ${workshop.Location}</p>
        `);
        $("#workshop-image").attr("src", workshop.LinkToPicture);
        $("#workshop-details-modal").modal("show");
      });

      function formatDate(dateString) {
    const date = new Date(dateString); 
    // toLocaleDateString zet de datum om naar nederlandse notatie
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }