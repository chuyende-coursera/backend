import users from './vi-Vi/users';
import posts from './vi-Vi/posts';
import comments from './vi-Vi/comments';
import medias from './vi-Vi/medias';
import friends from './vi-Vi/friends';
import blacklist from './vi-Vi/blacklist';
import reports from './vi-Vi/reports';
import messages from './vi-Vi/messages';
import notifications from './vi-Vi/notifications';

export default {
	// Định nghĩa thông tin chung cho phần thông báo
	'api.message.infoError': 'Lấy thông tin xác thực thất bại!',
	'api.message.infoAfterCreateError': 'Lỗi không lấy được bản ghi mới sau khi tạo thành công',
	'api.message.infoAfterEditError': 'Lấy thông tin sau khi thay đổi thất bại',
	'api.message.notExisted': 'Bản ghi này không tồn tại!',

	// mobile: 'Số điện thoại',
	// placesId: 'ID cơ sở',

	// wardsId: 'Id Phường xã',

	creatorsId: 'Id người tạo khóa học',
	status: 'Trạng thái',
	createDate: 'Ngày tạo',
	FromDate: 'Ngày bắt đầu tìm kiếm',
	ToDate: 'Ngày kết thúc tìm kiếm',

	/* ĐỊNH NGHĨA THÔNG TIN RIÊNG CỦA TỪNG PHẦN */

	// users
	...users,
	users: 'Tài khoản ',
	userId: 'Id tài khoản',

	// posts
	...posts,
	posts: 'Bài viết',
	postId: 'Id tài khoản',

	// media
	...medias,
	medias: 'Tệp truyển thông',
	mediaId: 'Id Tệp',

	// comments
	...comments,

	// friends
	...friends,
	
	// blacklist
	...blacklist,
	blacklist: 'Danh sạch đen user',
	blacklistId: 'Id danh sách đen',

	// Reports
	...reports,

	// Messages
	...messages,

	// Notifications
	...notifications,
};
