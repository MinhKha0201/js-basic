document.addEventListener("DOMContentLoaded", () => {

    const usersApi = "https://admob.lutech.vn/api/users"
    const teamsApi = "https://admob.lutech.vn/api/teams"
    const appsApi = "https://admob.lutech.vn/api/apps"
    var usersData = []
    var appSelected = []
    var teamSelected = []


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
                 ${user.teams.length > 0 ? user.teams[0].name : "Select Team"}
                </button>
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
               <button id="button-app" user-id="${user.id}"
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
                appOpenModal(userId)
            });
        });
    }

    const fetchData = async () => {
        try {
            const usersResponse = await fetch(usersApi)
            const usersJson = await usersResponse.json()
            usersData = [...usersJson.data]
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
    const searchInput = document.querySelector("#search")
    const searchForm = document.querySelector("#form")




    const appModalClose = () => {
        appModal.classList.remove('fadeIn');
        appModal.classList.add('fadeOut');
        setTimeout(() => {
            appModal.style.display = 'none';
        }, 500);
    }

    const appOpenModal = async (userId) => {
        appModal.classList.remove('fadeOut');
        appModal.classList.add('fadeIn');
        appModal.style.display = 'flex';
        try {
            confirm.setAttribute("user-id", userId)
            const appsResponse = await fetch(appsApi)
            var appsData = await appsResponse.json()
            const user = usersData.filter(user => user.id === parseInt(userId))

            var searchValue = ""
            searchInput.addEventListener('change', (event) => {
                searchValue = event.target.value
            })

            const appsDataTemp = [...appsData]
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault()
                if (searchValue.trim() !== "") {
                    appsData = appsData.filter(app => app.name.toLowerCase().includes(searchValue.toLowerCase()))
                }
                else {
                    appsData = [...appsDataTemp]
                }
                var lies1 = appsList.querySelectorAll("li")
                lies1.forEach(li => {
                    appsList.removeChild(li)
                })
                appsData.forEach(app => {
                    if (ids1.length && ids1.includes(app.app_id)) {
                        appsList.innerHTML += `<li class="flex gap-2 p-4"><input app-id="${app.app_id}" id="${app.app_id}" checked type="checkbox"
                    ><label for="${app.app_id}">${app.name}</label></li>`
                    } else {
                        appsList.innerHTML += `<li class="flex gap-2 p-4"><input app-id="${app.app_id}" id="${app.app_id}" type="checkbox"
                    ><label for="${app.app_id}">${app.name}</label></li>`
                    }
                })
            })



            appSelected = [...user[0].apps]

            count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
            const ids1 = user[0].apps.map(item => item.app_id);

            var lies1 = appsList.querySelectorAll("li")
            lies1.forEach(li => {
                appsList.removeChild(li)
            })
            appsData.forEach(app => {
                if (ids1.length && ids1.includes(app.app_id)) {
                    appsList.innerHTML += `<li class="flex gap-2 p-4"><input app-id="${app.app_id}" id="${app.app_id}" checked type="checkbox"
                    ><label for="${app.app_id}">${app.name}</label></li>`
                } else {
                    appsList.innerHTML += `<li class="flex gap-2 p-4"><input app-id="${app.app_id}" id="${app.app_id}" type="checkbox"
                    ><label for="${app.app_id}">${app.name}</label></li>`
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
            var isCheckedAll = true

            const DeleteAll = () => {
                const lies = document.querySelectorAll("#app-selected-list>li")
                lies.forEach(li => {
                    li.remove()
                })
                appSelected = []
                checkedAll.checked = false
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false
                })
                count.innerText = "None Selected"
            }

            DeleteAllButton.addEventListener("click", () => {
                DeleteAll()
            })

            for (let checkbox of checkboxes) {
                if (checkbox.checked === false) {
                    isCheckedAll = false
                    break
                }
            }
            checkedAll.checked = isCheckedAll
            checkedAll.addEventListener("change", e => {
                isCheckedAll = e.target.checked;
                if (isCheckedAll) {
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = true
                    })
                    appSelected = [...appsData]
                    count.innerText = `${appSelected.length} Selected`
                    appSelected.map(app => {
                        appsSelectedList.innerHTML += `<li class="${app.app_id} flex justify-between p-4 items-center">
                                                            <p class="max-w-[200px] text-wrap">
                                                            ${app.name}</p>
                                                            <button class="text-red-500">Delete</button>
                                                        </li>`
                    })
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
                    count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
                }
            })

            // checkbox 
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    const isChecked = event.target.checked;
                    const appId = event.target.getAttribute('app-id')
                    const app = appsData.filter(app => app.app_id === appId)
                    if (isChecked) {
                        appSelected = [...appSelected, ...app]
                        count.innerText = `${appSelected.length} Selected`
                        appsSelectedList.innerHTML += `<li class="${app[0].app_id} flex justify-between p-4 items-center">
                                                            <p class="max-w-[200px] text-wrap">
                                                            ${app[0].name}</p>
                                                            <button app-id="${app[0].app_id}" class="text-red-500">Delete</button>
                                                        </li>`
                    } else {
                        appSelected = appSelected.filter(app => app.app_id !== appId)
                        checkedAll.checked = false
                        count.innerText = appSelected.length > 0 ? `${appSelected.length} Selected` : "None Selected"
                        const li = appsSelectedList.getElementsByClassName(`${app[0].app_id}`)
                        console.log(li);
                        appsSelectedList.removeChild(li[0])
                    }
                });
            });
            confirm.addEventListener('click', (event) => {
                confirm.innerText = "Loading..."
                setTimeout(() => {
                    const userId = event.target.getAttribute("user-id")
                    usersData = usersData.map(user => {
                        return user.id === parseInt(userId) ? { ...user, apps: [...appSelected] } : user
                    }
                    )
                    appModalClose()
                    confirm.innerText = "Confirm"
                    var trs = body.querySelectorAll("tr")
                    trs.forEach(tr => {
                        body.removeChild(tr)
                    })
                    render(usersData)
                }, 1000)
                // const userId = event.target.getAttribute("user-id")
                // usersData = usersData.map(user => {
                //     return user.id === parseInt(userId) ? { ...user, apps: [...appSelected] } : user
                // }
                // )
                // appModalClose()
                // var trs = body.querySelectorAll("tr")
                // trs.forEach(tr => {
                //     body.removeChild(tr)
                // })
                // render(usersData)
            })

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