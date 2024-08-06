document.addEventListener("DOMContentLoaded", () => {

    const usersApi = "https://admob.lutech.vn/api/users"
    const teamsApi = "https://admob.lutech.vn/api/teams"
    const appsApi = "https://admob.lutech.vn/api/apps"
    var usersData = []
    var appSelected = []
    var teamSelected = []
    var isCheckedAll = false

    const render = (usersData) => {
        usersData.map((user) => {
            body.innerHTML += `<tr class="bg-gray-100 border-b">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                ${user.name}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <button id="button-team" user-id="${user.id}" team-id="${user.teams.map(team => team.id)}"
                class="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                >
                 ${user.teams.length > 0 ? user.teams.length + " Selected" : "Select Team"}
                </button>
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
               <button id="button-app" user-id="${user.id}" data='${JSON.stringify(user.apps)}'
                class="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                >
                ${user.apps.length > 0 ? user.apps.length + " Selected" : "Select App"}
                
                </button>
              </td>
            </tr>`
        })

        const teamButtons = document.querySelectorAll("#button-team")
        teamButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                // Lấy giá trị của thuộc tính data-id của nút đã bấm
                const teamId = event.target.getAttribute('team-id');
                const userId = event.target.getAttribute('user-id');
                teamOpenModal(teamId, userId)
            });
        });
        const appButtons = document.querySelectorAll("#button-app")
        appButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const userId = event.target.getAttribute('user-id');
                const dataString = event.target.getAttribute('data');
                appOpenModal(userId, dataString)
            });
        });
    }

    const fetchData = async () => {
        try {
            const usersResponse = await fetch(usersApi)
            const usersJson = await usersResponse.json()
            usersData = [...usersJson.data]
            // usersData.map((user) => {
            //     body.innerHTML += `<tr class="bg-gray-100 border-b">
            //   <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            //   <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            //     ${user.name}
            //   </td>
            //   <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            //     <button id="button-team" user-id="${user.id}" team-id="${user.teams.map(team => team.id)}"
            //     class="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            //     data-ripple-light="true"
            //     >
            //     Select Team
            //     </button>
            //   </td>
            //   <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            //    <button id="button-app" user-id="${user.id}" data='${JSON.stringify(user.apps)}'
            //     class="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            //     data-ripple-light="true"
            //     >
            //     ${user.apps.length > 0 ? user.apps.length + " Selected" : "Select App"}

            //     </button>
            //   </td>
            // </tr>`
            // })

            // const teamButtons = document.querySelectorAll("#button-team")
            // teamButtons.forEach((button) => {
            //     button.addEventListener('click', (event) => {
            //         // Lấy giá trị của thuộc tính data-id của nút đã bấm
            //         const teamId = event.target.getAttribute('team-id');
            //         const userId = event.target.getAttribute('user-id');
            //         teamOpenModal(teamId, userId)
            //     });
            // });
            // const appButtons = document.querySelectorAll("#button-app")
            // appButtons.forEach((button) => {
            //     button.addEventListener('click', (event) => {
            //         const userId = event.target.getAttribute('user-id');
            //         const dataString = event.target.getAttribute('data');
            //         appOpenModal(userId, dataString)
            //     });
            // });
            render(usersData)

        } catch (error) {
            console.log(error);
        }
    }

    fetchData()


    const body = document.querySelector("#body")
    const teamModal = document.querySelector('.team-modal');
    const appModal = document.querySelector('.app-modal');
    const teamCloseButton = document.querySelectorAll('.team-modal-close');
    const closeButton = document.querySelectorAll('.modal-close');
    const appsList = document.querySelector("#app-list")
    const appsSelectedList = document.querySelector("#app-selected-list")
    const DeleteAllButton = document.querySelector("#delete-all")
    const count = document.querySelector("#count")
    const confirm = document.querySelector("#confirm")

    confirm.addEventListener('click', (event) => {
        const data = JSON.parse(event.target.getAttribute("data"))
        const userId = event.target.getAttribute("user-id")
        usersData = usersData.map(user => {
            return user.id === parseInt(userId) ? { ...user, apps: [...data] } : user
        }
        )
        appModalClose()
        var trs = body.querySelectorAll("tr")
        trs.forEach(tr => {
            body.removeChild(tr)
        })
        render(usersData)
    })

    const DeleteAll = () => {
        isCheckedAll = false
        const lies = document.querySelectorAll("#app-selected-list>li")
        lies.forEach(li => {
            li.remove()
        })
        appSelected = []
        confirm.setAttribute("data", JSON.stringify(appSelected))
        count.innerText = "None Selected"
        console.log(appSelected);
    }
    DeleteAllButton.addEventListener("click", () => {
        DeleteAll()
    })


    const appModalClose = () => {
        appModal.classList.remove('fadeIn');
        appModal.classList.add('fadeOut');
        setTimeout(() => {
            appModal.style.display = 'none';
        }, 500);
    }

    const appOpenModal = async (userId, dataString) => {
        appModal.classList.remove('fadeOut');
        appModal.classList.add('fadeIn');
        appModal.style.display = 'flex';
        try {
            isCheckedAll = false
            const appsResponse = await fetch(appsApi)
            const appsData = await appsResponse.json()
            const data = JSON.parse(dataString)
            appSelected = [...data]

            confirm.setAttribute("data", JSON.stringify(appSelected))
            confirm.setAttribute("user-id", userId)

            count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
            const ids1 = data.map(item => item.app_id);

            var lies1 = appsList.querySelectorAll("li")
            lies1.forEach(li => {
                appsList.removeChild(li)
            })
            appsData.forEach(app => {
                if (ids1.length && ids1.includes(app.app_id)) {
                    appsList.innerHTML += `<li class="flex gap-2 p-4"><input data-object='${JSON.stringify(app)}' checked type="checkbox" name="" id="${app.app_id}"><label for="${app.app_id}">${app.name}</label></li>`
                } else {
                    appsList.innerHTML += `<li class="flex gap-2 p-4"><input data-object='${JSON.stringify(app)}' type="checkbox" name="" id="${app.app_id}"><label for="${app.app_id}">${app.name}</label></li>`
                }
            })


            var lies2 = appsSelectedList.querySelectorAll("li")
            lies2.forEach(li => {
                appsSelectedList.removeChild(li)
            })
            appSelected.forEach(app => {
                appsSelectedList.innerHTML += `<li class="${app.app_id} flex justify-between p-4 items-center">
                    <p class="max-w-[200px] text-wrap">
                      ${app.name}</p>
                    <button app-id="${app.app_id}" class="text-red-500">Delete</button>
                  </li>`
            })

            // all checkboxes
            const checkboxes = document.querySelectorAll('li>input[type="checkbox"]');
            const checkedAll = document.querySelector("#all")
            checkedAll.addEventListener("change", e => {
                isCheckedAll = e.target.checked;
                if (isCheckedAll) {
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = true
                    })
                    appSelected = [...appsData]
                    confirm.setAttribute("data", JSON.stringify(appSelected))
                    count.innerText = `${appSelected.length} Selected`
                    appSelected.map(app => {
                        appsSelectedList.innerHTML += `<li class="${app.app_id} flex justify-between p-4 items-center">
                    <p class="max-w-[200px] text-wrap">
                      ${app.name}</p>
                    <button class="text-red-500">Delete</button>
                  </li>`
                    })
                    confirm.setAttribute("data", JSON.stringify(appSelected))
                }
                else {
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false
                    })
                    const lies = document.querySelectorAll("#app-selected-list>li")
                    lies.forEach(li => {
                        li.remove()
                    })
                    appSelected = []

                    confirm.setAttribute("data", JSON.stringify(appSelected))
                    count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
                }
            })

            // checkbox 
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    const isChecked = event.target.checked;
                    const app = event.target.getAttribute('data-object')
                    if (isChecked) {
                        appSelected.push(JSON.parse(app))
                        count.innerText = `${appSelected.length} Selected`
                        confirm.setAttribute("data", JSON.stringify(appSelected))
                        appsSelectedList.innerHTML += `<li class="${JSON.parse(app).app_id} flex justify-between p-4 items-center">
                                                            <p class="max-w-[200px] text-wrap">
                                                            ${JSON.parse(app).name}</p>
                                                            <button app-id="${JSON.parse(app).app_id}" class="text-red-500">Delete</button>
                                                        </li>`
                    } else {
                        isCheckedAll = false
                        appSelected = appSelected.filter(app => app.app_id !== event.target.getAttribute("id"))
                        confirm.setAttribute("data", JSON.stringify(appSelected))
                        count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
                        const li = appsSelectedList.getElementsByClassName(`${JSON.parse(app).app_id}`)
                        console.log(li);
                        appsSelectedList.removeChild(li[0])
                    }

                    console.log(appSelected);
                });
            });


        } catch (error) {
            console.log(error);
        }
    }

    for (let i = 0; i < teamCloseButton.length; i++) {

        const elements = teamCloseButton[i];

        elements.onclick = (e) => teamModalClose();

        teamModal.style.display = 'none';

        window.onclick = function (event) {
            if (event.target == teamModal) teamModalClose();
        }
    }

    const teamModalClose = () => {
        teamModal.classList.remove('fadeIn');
        teamModal.classList.add('fadeOut');
        setTimeout(() => {
            teamModal.style.display = 'none';
        }, 500);
    }

    const teamOpenModal = async (teamId, userId) => {
        teamModal.classList.remove('fadeOut');
        teamModal.classList.add('fadeIn');
        teamModal.style.display = 'flex';
        try {
            const teamsResponse = await fetch(teamsApi)
            const teamsData = await teamsResponse.json()
            const teamsList = document.querySelector("#team-list")
            teamsList.innerHTML = `<ul>${teamsData.map(team => `<li class="p-2 border-2 mb-2 rounded ${team.id === parseInt(teamId) ? "border-green-500 bg-green-500 text-white" : ""}"><button user-id="${userId}" team-id="${team.id}" data='${JSON.stringify(team)}' class="w-full">${team.name}</button></li>`).join("")}</ul>`
            const buttons = teamsList.querySelectorAll("button")
            console.log(buttons);
            buttons.forEach(button => {
                button.addEventListener("click", (event) => {
                    const userId = event.target.getAttribute("user-id")
                    const teamId = event.target.getAttribute("team-id")
                    const data = JSON.parse(event.target.getAttribute("data"))
                    teamSelected = [data]
                    usersData = usersData.map(user => {
                        return user.id === parseInt(userId) ? { ...user, teams: [...teamSelected] } : user
                    }
                    )
                    teamModalClose()
                    var trs = body.querySelectorAll("tr")
                    trs.forEach(tr => {
                        body.removeChild(tr)
                    })
                    console.log(usersData);
                    render(usersData)
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    for (let i = 0; i < closeButton.length; i++) {

        const elements = closeButton[i];

        elements.onclick = (e) => appModalClose();

        teamModal.style.display = 'none';

        window.onclick = function (event) {
            if (event.target == teamModal) appModalClose();
        }
    }

    const selectTeam = (userId, teamString) => {
        const user = usersData.find(user => user.id === parseInt(userId))
        if (user) {
            const team = JSON.parse(teamString)
            user.teams.push(team)
            console.log(usersData);
            teamModalClose()
        }
    }



})