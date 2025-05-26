export const formatNumber = (num) => {
  if (num === null) return null;
  let display = num.toString();

  if (num >= 1_000_000_000) {
    display = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    display = (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    display = (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return <span title={num.toLocaleString()}>{display}</span>;
};

export const formattedPrice = (price = 0) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Math.max(price, 0));
};

export const formattedDate = (dateString, daysToAdd = 0) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Return formatted date as "dd-mm-yyyy"
  return `${day}-${month}-${year}`;
};

export const formattedFullDate = (dateString, daysToAdd = 0) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Get the day of the week
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // "Monday"

  // Get the day of the month
  const day = date.getDate();

  // Add suffix to the day
  const suffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Handle special cases for 11th, 12th, and 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get the month (in abbreviated format)
  const month = date.toLocaleString("en-US", { month: "short" }); // "Nov"

  // Get the year
  const year = date.getFullYear();

  // Return formatted date as "Monday, Nov 9th 2024"
  return `${dayOfWeek}, ${month} ${day}${suffix(day)} ${year}`;
};

export const formattedDateTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

export const normalizeVietnameseAddressNoMark = (ward, district, province) => {
  const removeDiacritics = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const removeLeadingPrefix = (str) => {
    const prefixes = [
      "Phường",
      "P.",
      "Xã",
      "Thị trấn",
      "Thị xã",
      "Quận",
      "Q.",
      "Huyện",
      "TP.",
      "Thành phố",
      "Tỉnh",
      "Thành phố trực thuộc Trung ương",
    ];

    const regex = new RegExp(
      `^(${prefixes.join("|")})\\s+`,
      "i"
    );
    return str.replace(regex, "").trim();
  };

  const parts = [ward, district, province]
    .filter(Boolean)
    .map((part) => {
      const trimmed = part.trim();
      const noPrefix = removeLeadingPrefix(trimmed);
      const noMark = removeDiacritics(noPrefix);
      return noMark;
    });

  return parts.join(", ");
};