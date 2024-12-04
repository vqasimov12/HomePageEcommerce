//Category

const pageSize = 8;
let currentPage = 1;
var category = "";

$("#tech").click(() => {
  $("#productsDiv").html("");
  category = category === "" ? "tech" : "";
  currentPage = 1;
  getProducts();
});

$("#fashion").click(() => {
  $("#productsDiv").html("");
  category = category === "" ? "fashion" : "";
  currentPage = 1;
  getProducts();
});

$("#furniture").click(() => {
  $("#productsDiv").html("");
  category = category === "" ? "furniture" : "";
  currentPage = 1;
  getProducts();
});

// Add to basket ; Details page

const getAccessToken = () => {
  let accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  return accessToken ?? "";
};

function detailsPage(id) {
  const params = new URLSearchParams();
  params.append("productId", id);
  const queryString = params.toString();
  const url = `http://127.0.0.1:5500/details.html?${queryString}`;
  window.location = url;
}

async function addBasket(id) {
  let accessToken = getAccessToken();
  // const encodedAccessToken = encodeURIComponent(accessToken);
  // console.log(accessToken);
  if (accessToken !== "")
    try {
      const response = await fetch("http://localhost:3000/api/baskets/add", {
        method: "POST",
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Ensure this is set correctly
        },
      });
      if (!response.ok) throw new Error(response.message);

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  else window.location.href = "singIn.html";
}

// Explore

const getProducts = async () => {
  try {
    let url = ``;

    if (category === "") {
      $("#viewMoreBtn").css("display", "inline-block");
      // console.log(currentPage);
      url = `http://localhost:3000/api/products?pageSize=${pageSize}&page=${currentPage}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Fetch failed!");

      const data = await response.json();
      const totalPages = data.totalPages;
      updateProducts(data);

      currentPage++;

      if (currentPage > totalPages) {
        $("#viewMoreBtn").css("display", "none");
      }
    } else {
      $("#viewMoreBtn").css("display", "none");
      url = `http://localhost:3000/api/products?category=${category}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Fetch failed!");

      const data = await response.json();
      updateProducts(data);
    }
  } catch (error) {
    console.error(error);
  }
};

function updateProducts(data) {
  const products = data.products;

  products.map((product) => {
    // console.log(product);
    var parentDiv = $("<div></div>");
    parentDiv.css({
      width: "290px",
      height: "400px",
      display: "flex",
      "flex-direction": "column",
      cursor: "pointer",
    });

    var childDiv = $("<div></div>");
    childDiv.css({
      width: "290px",
      height: "270px",
      "background-color": "#F5F5F5",
      "border-radius": "4px",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "flex-direction": "column",
      overflow: "hidden",
      position: "relative",
    });

    var img = $("<img>");
    img.attr("src", product.gallery[0]);

    img.css({
      width: "65%",
      height: "auto",
      padding: "20px",
      position: "relative",
      "z-index": "0",
    });

    var hoverDiv = $("<div></div>");
    hoverDiv
      .css({
        "background-color": "black",
        color: "white",
        "font-size": "16px",
        "font-family": "poppins",
        "font-weight": "500",
        display: "none",
        "justify-content": "center",
        "align-items": "center",
        width: "290px",
        height: "41px",
        bottom: "0",
        "border-bottom-left-radius": "4px",
        "border-bottom-right-radius": "4px",
        position: "absolute",
        "z-index": "1",
        cursor: "pointer",
      })
      .text("Add to basket");
    hoverDiv.click((event) => {
      event.stopPropagation();
      addBasket(product._id);
    });
    childDiv.append(img);
    childDiv.append(hoverDiv);
    childDiv.mouseenter(() => {
      hoverDiv.css("display", "flex");
    });
    childDiv.mouseleave(() => {
      hoverDiv.css("display", "none");
    });

    var title = $("<h3></h3>");
    title
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        "padding-top": "16px",
      })
      .text(product.title);

    var price = $("<p></p>");
    price
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        color: "#DB4444",
        "padding-bottom": "60px",
      })
      .text("$" + product.price);

    parentDiv.append(childDiv);
    parentDiv.append(title);
    parentDiv.append(price);
    parentDiv.on("click", () => {
      detailsPage(product._id);
    });
    $("#productsDiv").append(parentDiv);
  });
}

$("#viewMoreBtn").click(() => getProducts());

//Searchbar, Navbar

$("#profileBtn").click((event) => {
  const profileOptions = $("#profileOptions");

  event.stopPropagation();

  if (profileOptions.hasClass("hidden")) {
    profileOptions.removeClass("hidden").fadeIn(200);
  } else {
    profileOptions.fadeOut(200, () => {
      profileOptions.addClass("hidden");
    });
  }
});

$("#body").click(() => {
  const profileOptions = $("#profileOptions");

  if (!profileOptions.hasClass("hidden")) {
    setTimeout(() => {
      profileOptions.fadeOut(200, () => {
        profileOptions.addClass("hidden");
      });
    }, 10);
  }
});

$("#searchInput").on("keydown", async function (event) {
  if (event.key === "Enter") {
    const searchTerm = $("#searchInput").val().trim();
    if (searchTerm) {
      $("#searchedText").text(searchTerm);
      // $("#more").addClass("hidden");
      if ($("#more").hasClass("hidden")) $("#more").removeClass("hidden");
      $("#overLay").removeClass("hidden").fadeIn(200);
      $("#body").addClass("overflow-hidden");

      const result = await searchProducts(searchTerm);
      $("#searchProducts").html("");
      if (result === undefined) $("#more").addClass("hidden");

      if (result.length !== 0) {
        $("#notFound").fadeOut(200, function () {
          $(this).addClass("hidden");
          window.scrollTo({ top: 0, behavior: "smooth" });

          createCardItems(result);
        });
      } else {
        $("#notFound").removeClass("hidden").fadeIn(200);
      }
    } else {
      console.log("Input is empty!");
    }
  }
});

$("#searchInput").on("input", () => {
  elementCount = 4;
});

let elementCount = 4;

$("#overLay").click((event) => {
  if (event.target === event.currentTarget) {
    $("#overLay").fadeOut(200, function () {
      $(this).addClass("hidden");
      $("#body").removeClass("overflow-hidden");
      $("#searchInput").val("");
      elementCount = 4;
    });
  }
});

$("#myProfileLink").click(() => {
  if (document.cookie.includes("accessToken="))
    window.location.href = "/profile.html";
  else window.location.href = "/signIn.html";
});

$("#myAccount").click(() => {
  if (document.cookie.includes("accessToken="))
    window.location.href = "/profile.html";
  else window.location.href = "/signIn.html";
});

$("#shoppingCartLink").click(() => {
  if (document.cookie.includes("accessToken="))
    window.location.href = "/basket.html";
  else window.location.href = "/signIn.html";
});
$("#basketLink").click(() => {
  if (document.cookie.includes("accessToken="))
    window.location.href = "/basket.html";
  else window.location.href = "/signIn.html";
});

$("#logOutBtn").click(
  () => (document.cookie = "accessToken=; path=/; max-age=0")
);
const searchProducts = async (term) => {
  const url = `http://localhost:3000/api/products?searchTerm=${encodeURIComponent(
    term
  )}&pageSize=${elementCount}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch product data. Please try again later.");
    }

    const data = await response.json();

    if (data.products.length === 0) {
      $("#notFound").fadeIn(200, function () {
        $(this).removeClass("hidden");
      });

      $("#more").addClass("hidden");
      return [];
    }

    const temp = await fetch(
      `http://localhost:3000/api/products?searchTerm=${encodeURIComponent(
        term
      )}&pageSize=${50}`
    );
    if (!temp.ok) {
      throw new Error("Failed to fetch product data. Please try again later.");
    }

    const tempData = await temp.json();

    if (data.products.length >= tempData.products.length) {
      $("#more").addClass("hidden");
    }
    return data.products;
  } catch (e) {
    console.log(e.message);
    $("#notFound").fadeIn(200, function () {
      $(this).removeClass("hidden");
    });
    $("#more").addClass("hidden");
    return [];
  }
};

const createCardItems = (products) => {
  products.map((product) => {
    // console.log(product);
    var parentDiv = $("<div></div>");
    parentDiv.css({
      width: "220px",
      height: "350px",
      display: "flex",
      "flex-direction": "column",
      cursor: "pointer",
      gap: "5px",
    });

    var childDiv = $("<div></div>");
    childDiv.css({
      width: "200px",
      height: "150px",
      "background-color": "#F5F5F5",
      "border-radius": "4px",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "flex-direction": "column",
      overflow: "hidden",
      position: "relative",
    });

    var img = $("<img>");
    img.attr("src", product.gallery[0]);

    img.css({
      width: "65%",
      height: "auto",
      padding: "20px",
      position: "relative",
      "z-index": "0",
    });

    var hoverDiv = $("<div></div>");
    hoverDiv
      .css({
        "background-color": "black",
        color: "white",
        "font-size": "16px",
        "font-family": "poppins",
        "font-weight": "500",
        display: "none",
        "justify-content": "center",
        "align-items": "center",
        width: "290px",
        height: "41px",
        bottom: "0",
        "border-bottom-left-radius": "4px",
        "border-bottom-right-radius": "4px",
        position: "absolute",
        "z-index": "1",
        cursor: "pointer",
      })
      .text("Add to basket");
    hoverDiv.click((event) => {
      event.stopPropagation();
      addBasket(product._id);
    });
    childDiv.append(img);
    childDiv.append(hoverDiv);
    childDiv.mouseenter(() => {
      hoverDiv.css("display", "flex");
    });
    childDiv.mouseleave(() => {
      hoverDiv.css("display", "none");
    });

    var title = $("<h3></h3>");
    title
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        "padding-top": "16px",
        width: "200px",
        height: "55px",
      })
      .text(product.title);

    var price = $("<p></p>");
    price
      .css({
        "font-size": "16px",
        "font-weight": "500",
        "font-family": "poppins",
        color: "#DB4444",
        "padding-bottom": "60px",
      })
      .text("$" + product.price);

    parentDiv.append(childDiv);
    parentDiv.append(title);
    parentDiv.append(price);
    parentDiv.on("click", () => {
      detailsPage(product._id);
    });
    $("#searchProducts").append(parentDiv);
  });
};

$("#more").click(() => {
  elementCount += 4;
  $("#searchInput").trigger($.Event("keydown", { key: "Enter" }));
  $("#searchProducts").animate(
    {
      scrollTop: $("#searchProducts")[0].scrollHeight,
    },
    500
  );
});

getProducts();
document.cookie = `accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGI2NzViNmJkMjc4ZTU5ZDMzN2YxNyIsImlhdCI6MTczMzMwNjU1MSwiZXhwIjoxNzMzMzA2ODUxfQ.pvrwD1sQ3SaeD286mUCzKIjcmg9osq_V1kDe2ftHPQs`;

// const signInRequest = async () => {
//   const response = await fetch("http://localhost:3000/api/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ email: "qasimov.vaqif@gmail.com", password: "123" }),
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   });
//   var data = await response.json();
// };

// signInRequest();

// const getALLBasket = async () => {
//   accessToken=getAccessToken()
//   let response = await fetch("http://localhost:3000/api/baskets/view", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${getAccessToken()}`,
//     },
//   });
//   let data = await response.json();
//   console.log(data);
// };
// getALLBasket()