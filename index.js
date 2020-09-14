//  *** CREATES DAYS LABLES FROM  VALUES RETURNED BY getDay()***
const createDayLables = dayNum => {
	switch (dayNum) {
		case 0:
			day = 'Sunday';
			break;
		case 1:
			day = 'Monday';
			break;
		case 2:
			day = 'Tuesday';
			break;
		case 3:
			day = 'Wednesday';
			break;
		case 4:
			day = 'Thursday';
			break;
		case 5:
			day = 'Friday';
			break;
		case 6:
			day = 'Saturday';
	}
	return day;
};
//  *** CALCULATES DAY GIVEN A DATE AND AN YEAR ***
const calculateDay = (date, year) => {
	let dayNum = new Date([...date.slice(0, 6), ...year].join('')).getDay();
	let day = createDayLables(dayNum);
	return day;
};
//  *** CALCULATES INITIALS FROM NAME***
const calculateInitials = name => {
	let initials = name
		.split(' ')
		.map(cur => cur.split('')[0])
		.join('');
	return initials;
};
//  *** RETURNS THE LIST OF PEOPLE WHO WERE ALREADY BORN GIVEN THE YEAR***
const calculateBorn = (data, year) => {
	let born = data.filter(current => {
		return parseInt(current.birthday.slice(6)) <= parseInt(year);
	});
	return born;
};
//  *** CALCULATES DATA FOR RENDERING LOGIC***
const calculateRenderData = (data, year) => {
	let renderData = data.map(current => {
		let initials = calculateInitials(current.name);
		let day = calculateDay(current.birthday, year);
		return { initials, day, birthday: current.birthday };
	});
	return renderData;
};
//  *** GROUPS INITIALS BASED ON DAYS***
const getAllInitialsOfDay = (arr, day) => {
	const toBeSorted = arr
		.filter(cur => cur.day === day)
		.map(cur => {
			return { initials: cur.initials, birthday: cur.birthday };
		});
	return dateWiseSort(toBeSorted);
};
//  *** CALCULATES INITIALS FOR ALL THE DAYS***
const claculateDayWiseInitials = data => {
	const sun = getAllInitialsOfDay(data, 'Sunday');
	const mon = getAllInitialsOfDay(data, 'Monday');
	const tue = getAllInitialsOfDay(data, 'Tuesday');
	const wed = getAllInitialsOfDay(data, 'Wednesday');
	const thu = getAllInitialsOfDay(data, 'Thursday');
	const fri = getAllInitialsOfDay(data, 'Friday');
	const sat = getAllInitialsOfDay(data, 'Saturday');
	return [
		{
			day: 'Sunday',
			initials: sun,
		},
		{
			day: 'Monday',
			initials: mon,
		},
		{
			day: 'Tuesday',
			initials: tue,
		},
		{
			day: 'Wednesday',
			initials: wed,
		},
		{
			day: 'Thursday',
			initials: thu,
		},
		{
			day: 'Friday',
			initials: fri,
		},
		{
			day: 'Saturday',
			initials: sat,
		},
	];
};
//  *** SORTS ELEMENTS IN ASCENDING ORDER BASED ON DATE OF BIRTH***
const dateWiseSort = data => {
	const sorteddata = data.sort((a, b) => {
		return new Date(b.birthday) - new Date(a.birthday);
	});
	return sorteddata;
};
//  *** GENERATES RANDOM COLOURS***
const getRandomColor = () => {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};
//  *** SELECTS A RANDOM COLOUR***
const setRandomColor = () => {
	let cardInit = document.querySelectorAll('.card-init');
	cardInit.forEach(card => {
		card.style.backgroundColor = getRandomColor();
	});
};
//  *** RENDERS OUT THE ACTUAL RESULT***
const renderResults = () => {
	removeHtml();
	let data = [];
	let year = '';
	let born = [];
	let renderData = [];
	try {
		data = JSON.parse(document.querySelector('#text-area').value);
		year = document.querySelector('#year').value;
		if (parseInt(year) === NaN) {
			throw 'Invalid Year';
		}
	} catch (err) {
		document.querySelector('.error').style.display = 'block';
	}
	if (!data || !year) {
		document.querySelector('.error').style.display = 'block';
	}
	if (data.length) {
		born = calculateBorn(data, year);
	}
	renderData = calculateRenderData(born, year);
	const calConfigData = claculateDayWiseInitials(renderData);
	addHtml(calConfigData);
	setRandomColor();
};
//  *** CREATES HTML FROM A STRING EQUIVALENT***
const createElementFromHTML = htmlString => {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
};
//  *** ADDS THE GENERATED HTML TO THE DOM***
const addHtml = calConfigData => {
	let className;
	let colData = calConfigData.map(current =>
		current.initials.map(cur => {
			if (current.initials.length === 1) {
				className = 'card-init1';
			} else if (current.initials.length > 1 && current.initials.length < 5) {
				className = 'card-init2';
			} else {
				className = 'card-init3';
			}
			return `<div class="card-init ${className}">${cur.initials}</div>`;
		})
	);
	colData = [...colData.slice(1), ...colData.slice(0, 1)];
	const days = ['monday', 'tuesday', 'wednesday', 'thrusday', 'friday', 'saturday', 'sunday'];
	const renderArray = [];
	for (let i = 0; i < days.length; i++) {
		if (colData[i].length === 1) {
			className = 'cal-content1';
		} else if (colData[i].length > 1 && colData[i].length < 5) {
			className = 'cal-content2';
		} else {
			className = 'cal-content3';
		}
		renderArray.push(createElementFromHTML(`<div class="cal-content ${className}">${colData[i].join('')}</div>`));
	}
	const allCardsbody = document.querySelectorAll('.card');
	for (let i = 0; i < allCardsbody.length; i++) {
		allCardsbody[i].appendChild(renderArray[i]);
	}
};
//  *** FLUSHES OUT UNNECESSARY ELEMENTS FROM DOM***
const removeHtml = () => {
	const allCardsbody = document.querySelectorAll('.cal-content');
	for (let i = 0; i < allCardsbody.length; i++) {
		allCardsbody[i].innerHTML = '';
	}
	document.querySelector('.error').style.display = 'none';
};
document.querySelector('#update-button').addEventListener('click', renderResults);
