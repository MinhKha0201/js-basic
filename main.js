document.addEventListener("DOMContentLoaded", async () => {
  const usersApi = "https://admob.lutech.vn/api/users";
  const teamsApi = "https://admob.lutech.vn/api/teams";
  const appsApi = "https://admob.lutech.vn/api/apps";
  async function fetchApi(url, options = null) {
    return (await fetch(url, options)).json();
  }
  let usersData = [];
  let next_page_url = null;
  do {
    const usersRes = await fetchApi(
      next_page_url !== null ? next_page_url : usersApi
    );
    usersData = [...usersData, ...usersRes.data];
    next_page_url = usersRes.next_page_url;
  } while (next_page_url !== null);
  let appSelected = [];
  let teamSelected = [];
  let appsDataTemp = [];
  let searchValue = "";
  let appsData = await fetchApi(appsApi);

  const render = (usersData) => {
    const data = usersData
      .map((user) => {
        return `<tr class="bg-gray-100 border-b">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
                user.id
              }</td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                ${user.name}
              </td>
              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <button id="button-team" user-id="${
                  user.id
                }" team-id="${user.teams.map((team) => team.id)}"
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
                ${
                  user.apps.length > 0
                    ? user.apps.length + " Selected"
                    : "Select App"
                }
                
                </button>
              </td>
            </tr>`;
      })
      .join("");
    body.innerHTML = data;

    const teamButtons = document.querySelectorAll("#button-team");
    teamButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const teamId = event.target.getAttribute("team-id");
        const userId = event.target.getAttribute("user-id");
        teamOpenModal(teamId, userId);
      });
    });
    const appButtons = document.querySelectorAll("#button-app");
    appButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const userId = event.target.getAttribute("user-id");
        appOpenModal(userId, appsData);
      });
    });
  };

  const body = document.querySelector("#body");
  const teamModal = document.querySelector(".team-modal");
  const appModal = document.querySelector(".app-modal");
  const teamCloseButton = document.querySelectorAll(".team-modal-close");
  const closeButton = document.querySelectorAll(".modal-close");
  const appsList = document.querySelector("#app-list");
  const appsSelectedList = document.querySelector("#app-selected-list");
  const DeleteAllButton = document.querySelector("#delete-all");
  const count = document.querySelector("#count");
  const confirm = document.querySelector("#confirm");
  const checkedAll = document.querySelector("#all");

  render(usersData);

  const renderAppsData = (appsData, appSelected) => {
    const ids1 = appSelected.map((item) => item.app_id);
    const html = appsData
      .map((app) => {
        return `<li class="flex gap-2 p-4"><input id="${app.app_id}" ${
          ids1.length && ids1.includes(app.app_id) ? "checked" : ""
        } type="checkbox"
                    ><label for="${app.app_id}">${app.name}</label></li>`;
      })
      .join("");
    appsList.innerHTML = html;
  };

  const renderAppSelected = () => {
    const html = appSelected
      .map((app) => {
        return `<li class="${app.app_id} flex justify-between p-4 items-center">
                    <p class="max-w-[200px] text-wrap">
                      ${app.name}</p>
                    <button app-id="${app.app_id}" class="text-red-500">Delete</button>
                  </li>`;
      })
      .join("");
    appsSelectedList.innerHTML = html;
  };

  const handleDeleteBtn = () => {
    const checkboxes = document.querySelectorAll('li>input[type="checkbox"]');
    const buttons = appsSelectedList.querySelectorAll("button");
    for (let button of buttons) {
      button.addEventListener("click", (event) => {
        const appId = event.target.getAttribute("app-id");
        appSelected = appSelected.filter((app) => app.app_id !== appId);
        checkedAll.indeterminate = true;
        checkedAll.checked = false;
        if (appSelected.length < 1) {
          checkedAll.indeterminate = false;
        }
        event.target.parentNode.remove();
        count.innerText =
          appSelected.length > 0
            ? `${appSelected.length} Selected`
            : "None Selected";
        checkboxes.forEach((checkbox) => {
          if (appId === checkbox.getAttribute("id")) {
            checkbox.checked = false;
          }
        });
      });
    }
  };

  const handleCheckboxes = (checkedAll) => {
    const checkboxes = document.querySelectorAll('li>input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        const appId = event.target.getAttribute("id");
        const app = appsData.filter((app) => app.app_id === appId);
        if (isChecked) {
          checkedAll.indeterminate = true;
          appSelected = [...appSelected, ...app];
          if (appSelected.length === appsData.length) {
            checkedAll.indeterminate = false;
            checkedAll.checked = true;
          }
          count.innerText = `${appSelected.length} Selected`;
          renderAppSelected(appSelected);
          handleDeleteBtn(checkedAll);
        } else {
          appSelected = appSelected.filter((app) => app.app_id !== appId);
          checkedAll.indeterminate = true;
          if (appSelected.length < 1) {
            checkedAll.indeterminate = false;
          }
          renderAppSelected(appSelected);
          handleDeleteBtn(checkedAll);
          count.innerText =
            appSelected.length > 0
              ? `${appSelected.length} Selected`
              : "None Selected";
        }
      });
    });
  };

  const handleSearch = (searchInput) => {
    searchInput.value = searchValue;
    searchInput.addEventListener("keyup", (event) => {
      searchValue = event.target.value.trim();
      if (searchValue !== "") {
        appsDataTemp = appsData.filter((app) =>
          app.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else {
        appsDataTemp = [...appsData];
      }
      if (appsDataTemp.filter((x) => !appSelected.includes(x)).length === 0) {
        checkedAll.checked = true;
      } else {
        checkedAll.checked = false;
      }
      if (appsDataTemp.length > 0) {
        renderAppsData(appsDataTemp, appSelected);
        handleCheckboxAll();
        handleCheckboxes(checkedAll);
      } else {
        renderAppsData(appsData, appSelected);
      }
    });
  };

  const handleCheckboxAll = () => {
    const checkboxes = document.querySelectorAll('li>input[type="checkbox"]');
    checkedAll.addEventListener("change", (e) => {
      const isCheckedAll = e.target.checked;
      if (isCheckedAll) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });

        if (appsDataTemp.length > 0) {
          appSelected = [
            ...appSelected,
            ...appsDataTemp.filter(
              (obj1) => !appSelected.some((obj2) => obj1.app_id === obj2.app_id)
            ),
          ];
        } else {
          appSelected = [
            ...appSelected,
            ...appsData.filter(
              (obj1) => !appSelected.some((obj2) => obj1.app_id === obj2.app_id)
            ),
          ];
        }

        count.innerText = `${appSelected.length} Selected`;
        renderAppSelected();
        handleDeleteBtn();
      } else {
        checkedAll.checked = false;
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });

        if (appsDataTemp.length > 0) {
          appSelected = appSelected.filter((app1) => {
            return !appsDataTemp.some((app2) => app2.app_id === app1.app_id);
          });
        } else {
          appSelected = appSelected.filter((app1) => {
            return !appsData.some((app2) => app2.app_id === app1.app_id);
          });
        }

        renderAppSelected();
        handleDeleteBtn(checkedAll);
        count.innerText =
          appSelected.length > 0
            ? `${appSelected.length} Selected`
            : "None Selected";
      }
    });
  };

  const appModalClose = () => {
    appModal.classList.remove("fadeIn");
    appModal.classList.add("fadeOut");
    setTimeout(() => {
      appModal.style.display = "none";
    }, 500);
  };

  const appOpenModal = async (userId, appsData) => {
    appModal.classList.remove("fadeOut");
    appModal.classList.add("fadeIn");
    appModal.style.display = "flex";
    confirm.setAttribute("user-id", userId);
    const searchInput = document.querySelector("#search");
    let checkboxes;

    const user = usersData.find((user) => user.id === parseInt(userId));
    appSelected = [...user.apps];
    count.innerText =
      appSelected.length > 0
        ? `${appSelected.length} Selected`
        : "None Selected";

    renderAppsData(appsData, appSelected);
    renderAppSelected();
    handleDeleteBtn(checkedAll);
    checkboxes = document.querySelectorAll('li>input[type="checkbox"]');

    let isCheckedAll = true;
    let isIndeterminate = false;

    const DeleteAll = () => {
      appSelected = [];
      renderAppSelected(appSelected);
      checkedAll.indeterminate = false;
      checkedAll.checked = false;
      checkboxes = document.querySelectorAll('li>input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      count.innerText = "None Selected";
    };

    DeleteAllButton.addEventListener("click", () => {
      DeleteAll();
    });

    for (let checkbox of checkboxes) {
      if (checkbox.checked === false) {
        isCheckedAll = false;
        break;
      }
    }
    checkedAll.checked = isCheckedAll;
    checkedAll.indeterminate = isIndeterminate;
    handleCheckboxAll();
    handleCheckboxes(checkedAll);

    handleSearch(searchInput, checkedAll);
    confirm.addEventListener("click", (event) => {
      confirm.innerText = "Loading...";
      setTimeout(() => {
        const userId = event.target.getAttribute("user-id");
        usersData = usersData.map((user) => {
          return user.id === parseInt(userId)
            ? { ...user, apps: [...appSelected] }
            : user;
        });
        appModalClose();
        confirm.innerText = "Confirm";
        console.log(appSelected);
        render(usersData);
      }, 1000);
      searchValue = "";
    });
  };

  teamCloseButton[0].onclick = (e) => teamModalClose();

  teamModal.style.display = "none";

  teamModal.onclick = function (event) {
    if (event.target == teamModal) teamModalClose();
  };

  const teamModalClose = () => {
    teamModal.classList.remove("fadeIn");
    teamModal.classList.add("fadeOut");
    setTimeout(() => {
      teamModal.style.display = "none";
    }, 500);
  };

  const teamOpenModal = async (teamId, userId) => {
    teamModal.classList.remove("fadeOut");
    teamModal.classList.add("fadeIn");
    teamModal.style.display = "flex";
    try {
      const teamsResponse = await fetch(teamsApi);
      const teamsData = await teamsResponse.json();
      const teamsList = document.querySelector("#team-list");
      teamsList.innerHTML = `<ul>${teamsData
        .map(
          (team) =>
            `<li class="p-2 border-2 mb-2 rounded ${
              team.id === parseInt(teamId)
                ? "border-green-500 bg-green-500 text-white"
                : ""
            }"><button user-id="${userId}" team-id="${
              team.id
            }" data='${JSON.stringify(team)}' class="w-full">${
              team.name
            }</button></li>`
        )
        .join("")}</ul>`;
      const buttons = teamsList.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const userId = event.target.getAttribute("user-id");
          const teamId = event.target.getAttribute("team-id");
          const data = JSON.parse(event.target.getAttribute("data"));
          teamSelected = [data];
          usersData = usersData.map((user) => {
            return user.id === parseInt(userId)
              ? { ...user, teams: [...teamSelected] }
              : user;
          });
          teamModalClose();
          const trs = body.querySelectorAll("tr");
          trs.forEach((tr) => {
            body.removeChild(tr);
          });
          render(usersData);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  closeButton[0].onclick = (e) => appModalClose();

  appModal.style.display = "none";

  appModal.onclick = function (event) {
    if (event.target == appModal) appModalClose();
  };
});
