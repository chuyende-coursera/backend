import users from "./vi-Vi/users";
import topics from "./vi-Vi/topics";
import categories from "./vi-Vi/categories";
import courses from "./vi-Vi/courses";
import courseWeeks from "./vi-Vi/courseWeeks";
import weeks from "./vi-Vi/weeks";
import videoWeek from "./vi-Vi/videoWeek";
import languages from "./vi-Vi/languages";
import skills from "./vi-Vi/skills";
import jobs from "./vi-Vi/jobs";
import userCourse from "./vi-Vi/userCourse";
import groupUsers from "./vi-Vi/groupUsers";

export default {
  // Định nghĩa thông tin chung cho phần thông báo
  "api.message.infoError": "Lấy thông tin xác thực thất bại!",
  "api.message.infoAfterCreateError":
    "Lỗi không lấy được bản ghi mới sau khi tạo thành công",
  "api.message.infoAfterEditError": "Lấy thông tin sau khi thay đổi thất bại",
  "api.message.notExisted": "Bản ghi này không tồn tại!",

  mobile: "Số điện thoại",
  placesId: "ID cơ sở",

  wardsId: "Id Phường xã",

  creatorsId: "Id người tạo khóa học",
  status: "Trạng thái",
  createDate: "Ngày tạo",
  FromDate: "Ngày bắt đầu tìm kiếm",
  ToDate: "Ngày kết thúc tìm kiếm",

  /* ĐỊNH NGHĨA THÔNG TIN RIÊNG CỦA TỪNG PHẦN */

  // users
  ...users,
  users: "Tài khoản ",
  usersId: "Id tài khoản",

  // topics
  ...topics,
  topicsId: "Id nhóm danh mục",
  topics: "Nhóm danh mục",

  // categories
  ...categories,
  categoriesId: "Id danh mục",
  categories: "Danh mục",

  // courses
  ...courses,
  coursesId: "Id khóa học",
  courses: "Khóa học",

  // courseWeeks
  ...courseWeeks,
  courseWeek: "Tuần của khóa học",
  courseWeeksId: "Id tuần khóa học",

  // weeks
  ...weeks,
  weeks: "Tuần học",
  weeksId: "Id tuần học",

  // videoWeek
  ...videoWeek,
  videoWeek: "video của tuần",
  videoWeekId: "Id video của tuần",

  // skills
  ...skills,
  skills: "Kỹ năng",
  skillsId: "Id kỹ năng phù hợp",

  // languages
  ...languages,
  languages: "Ngôn ngữ khóa học",
  languagesId: "Id ngôn ngữ",

  //jobs
  ...jobs,
  jobsId: "Id công việc phù hợp",
  jobs: "Nghề nghiệp ứng với khóa học",

  // userCourse
  ...userCourse,
  userCourseId: "Id người khóa học",

  // groupUsers
  ...groupUsers,
  groupUsersId: "Id nhóm người dùng",
  groupUsers: "Nhóm người dùng",
};
