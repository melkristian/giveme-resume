import { faker } from '@faker-js/faker'

const toolsList = [
  'JavaScript', 'Java', 'PHP', 'Ms Word', 'Ms Excel', 'Ansible',
  'AWS Lambda', 'Google Cloud', 'Ruby', 'Figma', 'Fastify', 'ExpressJS',
  'Node.js', 'Rails', 'Python', 'Photoshop', 'Illustrator', 'Go',
  'Rust', 'Keynote', 'Bitbucket', 'Jira', 'Bamboo', 'BaseCamp',
  'Bootstrap', 'Angular', 'React', 'Vue', 'AWS API Gateway', 'AWS EC2',
  'Elastic Search', 'MySQL', 'MongoDB', 'Redis', 'WebStorm', 'Visual Studio Code'
]

export function createRandomId(suffix = 1){
  return `${Math.random().toString(16).slice(2)}${suffix}`
}

export function capitalizeWords(text = null) {
  return text.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}

export function createContact(firstName, lastName, country = 'USA') {
  return {
    email: faker.internet.email({ firstName, lastName}),
    phone: faker.phone.number(),
    website: faker.internet.url({ protocol: 'https'}),
    address: createAddress(country)
  }
}

export function createAddress(country = 'USA') {
  return {
    street1: faker.location.streetAddress(),
    street2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    stateCode: faker.location.state( { abbreviated: true }),
    postalCode: faker.location.zipCode(),
    countryCode: country === 'any' ? faker.location.countryCode('alpha-3') : country
  }
}

// An experience denotes one company with one or more positions
export function createExperience(numPositions = 1, index = 1, segments = []) {
  let positions = []
  let projects = []

  // Create positions under one company using allotted timeline segments that indicate the start and end dates
  for(let i = 1; i < segments.length; i++){
    positions.push(createPosition(segments[i], segments[i-1]))
  }

  // Optional projects for the whole company
  const maxProjects = getRandom(0, 5)
  for(let j = 0; j < maxProjects; j++){
    projects.push(createProject(j));
  }

  return {
    experienceId: createRandomId(index),
    company: faker.company.name(),
    positions,
    projects,
  }
}

export function createProject(index = 1) {
  // capitalize each word
  let projectName = capitalizeWords(faker.company.buzzPhrase())

  return {
    projectId: createRandomId(index),
    name: projectName,
    role: faker.person.jobTitle(),
    description: faker.lorem.sentences({ min: 2, max: 6}),
    technology: createTools(toolsList, 1, 7)
  }
}

export function createPosition(startDate, endDate) {
  return {
    title: faker.person.jobTitle(),
    startDate,
    endDate,
    summary: faker.lorem.sentences({ min: 3, max: 6 })
  }
}

export function createTools(toolsList = [], min = 1, max = 10){
  return faker.helpers.arrayElements(toolsList, { min, max })
}

export function createCategorizedTools(toolsList) {

  // Random category count
  const maxCategory = getRandom(1, 4)
  let tools = []
  let lastToolIndex = 0;
  for(let i = 1; i <= maxCategory; i++) {
    // Random max tools per category
    const maxToolsPerCategory = getRandom(1, 11);

    tools.push({
      categoryId: createRandomId(i),
      categoryName: capitalizeWords(faker.lorem.words({ min: 1, max: 3})),
      items: toolsList.slice(lastToolIndex, (lastToolIndex+maxToolsPerCategory))
    })

    lastToolIndex += maxToolsPerCategory
  }

  return tools
}

// Get random number between min and max inclusively courtesy of Mozilla
export function getRandom(min = 1, max = 10) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns a list of random dates in reverse chronological order as part of the experience timeline
export function createTimeline(startDate, cappedPositions = 1, cappedMonthsInterval = 120) {
  let  finalSegments = [];

  // Reverse chronology start date
  const sDate = (startDate instanceof Date) ? startDate : new Date(startDate)

  // Automatically include the start date as part of the timeline
  finalSegments.push(sDate.toISOString().substring(10, 0))

  // Build the timeline using a randomized number of months as the interval in between positions
  for(let i = 0; i < cappedPositions; i++){
    sDate.setDate(1)
    sDate.setMonth(-getRandom(1, cappedMonthsInterval))
    finalSegments.push(sDate.toISOString().substring(10, 0))
  }

  return finalSegments
}

export default function createResume(options = {
    maxPositions: 10,
    maxMonthsBetweenPositions: 120
  }, index = 1) {

  // Random maximum positions for one resume
  const randCappedPositions = getRandom(1, options.maxPositions)

  // Random maximum number of months per breaks in the timeline
  const randCappedMonths = getRandom(1, options.maxMonthsBetweenPositions)

  let timelineSegments = createTimeline(new Date(), randCappedPositions, randCappedMonths)
  let experiences = []
  let expCount = 1;

  const fName = faker.person.firstName()
  const lName = faker.person.lastName()

  while(timelineSegments.length > 0) {
    // Get the randomized number of positions for a company based on remaining intervals in the timeline
    let numPositionsOnSegment = getRandom(1, (timelineSegments.length - 1))

    // Copy relevant timeline for actual position interval generation
    let segmentsPerExp = timelineSegments.slice(0, numPositionsOnSegment+1)
    experiences.push(createExperience(numPositionsOnSegment, expCount, segmentsPerExp))

    // Decrease the available timeline intervals
    // Use up the timeline if the number of positions per company is the max
    timelineSegments.splice(0, (timelineSegments.length === segmentsPerExp.length) ? segmentsPerExp.length : numPositionsOnSegment)
    expCount++
  }

  return {
    resumeId: createRandomId(index),
    name: `${fName} ${lName}`,
    contact: createContact(fName, lName, options.country),
    summary: faker.lorem.sentences({ min: 1, max: 5 }),
    objective: faker.lorem.sentences({ min: 1, max: 3 }),
    experience: experiences,
    tools: createCategorizedTools(toolsList),
    photo: faker.image.url( { width: 300, height: 300 } )
  }
}