const fs = require('fs');
const path = require('path');

const contentDir = 'd:\\Code_BOX\\Antigravity\\DotNetTut\\public\\content';

const courseUrlMap = {
  'csharp-dot-net-tutorials': 'csharp',
  'dot-net-design-patterns': 'design-patterns',
  'microservices-using-asp-net-core-tutorials': 'microservices',
  'asp-net-core-tutorials': 'aspnet-core',
  'asp-net-core-web-api-tutorials': 'aspnet-core-webapi',
  'microsoft-azure-tutorials': 'azure',
  'asp-net-web-api': 'aspnet-webapi',
  'linq': 'linq',
  'ado-net-tutorial-for-beginners-and-professionals': 'ado-net',
  'solid-design-principles': 'solid-principles',
  'csharp-dot-net-programs': 'csharp-programs',
  'ms-sql-server': 'mssql',
  'data-structures-and-algorithms-for-beginners-and-professionals': 'dsa'
};

console.log('Building lesson to course map...');
const lessonToCourseMap = {}; // slug -> courseId

const courses = fs.readdirSync(contentDir);
for (const courseId of courses) {
  const coursePath = path.join(contentDir, courseId);
  if (fs.statSync(coursePath).isDirectory()) {
    const lessons = fs.readdirSync(coursePath);
    for (const lessonFile of lessons) {
      if (lessonFile.endsWith('.json')) {
        const slug = lessonFile.slice(0, -5); // remove .json
        lessonToCourseMap[slug] = courseId;
      }
    }
  }
}

console.log(`Mapped ${Object.keys(lessonToCourseMap).length} lessons to their courses.`);

console.log('Processing JSON files...');
let totalModified = 0;
let fileCount = 0;

function processFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processFiles(filePath);
    } else if (file.endsWith('.json')) {
      fileCount++;
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      let content = fileData.content || '';
      let isModified = false;
      
      // 1. Rewrite Lesson URLs: https://dotnettutorials.net/lesson/some-slug/
      const lessonRegex = /https?:\/\/(?:www\.)?dotnettutorials\.net\/lesson\/([a-zA-Z0-9-]+)\/?/gi;
      if (lessonRegex.test(content)) {
        content = content.replace(lessonRegex, (match, slug) => {
          const courseId = lessonToCourseMap[slug.toLowerCase()];
          if (courseId) {
            return `#/course/${courseId}/${slug}`;
          }
          // Fallback if course not found (e.g. check current file's folder as fallback)
          const currentFolder = path.basename(path.dirname(filePath));
          return `#/course/${currentFolder}/${slug}`;
        });
        isModified = true;
      }

      // 2. Rewrite Course URLs: https://dotnettutorials.net/course/some-course/
      const courseRegex = /https?:\/\/(?:www\.)?dotnettutorials\.net\/course\/([a-zA-Z0-9-]+)\/?/gi;
      if (courseRegex.test(content)) {
        content = content.replace(courseRegex, (match, courseSlug) => {
          const courseId = courseUrlMap[courseSlug.toLowerCase()];
          if (courseId) {
            return `#/course/${courseId}`;
          }
          return `#/course/${courseSlug}`;
        });
        isModified = true;
      }

      // 3. Remove data-wpfc-* and data-lazy-* attributes completely
      const wpfcRegex = /\s*data-wpfc-[a-z-]+="[^"]*"/gi;
      if (wpfcRegex.test(content)) {
        content = content.replace(wpfcRegex, '');
        isModified = true;
      }
      
      const lazyRegex = /\s*data-lazy-[a-z-]+="[^"]*"/gi;
      if (lazyRegex.test(content)) {
        content = content.replace(lazyRegex, '');
        isModified = true;
      }

      // 4. Remove any residual srcset or sizes attributes that might remain in other contexts
      const srcsetAttrRegex = /\s*srcset="[^"]*"/gi;
      if (srcsetAttrRegex.test(content)) {
        content = content.replace(srcsetAttrRegex, '');
        isModified = true;
      }
      
      const sizesAttrRegex = /\s*sizes="[^"]*"/gi;
      if (sizesAttrRegex.test(content)) {
        content = content.replace(sizesAttrRegex, '');
        isModified = true;
      }

      if (isModified) {
        fileData.content = content;
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
        totalModified++;
      }
    }
  }
}

processFiles(contentDir);
console.log(`Done! Scanned ${fileCount} files, cleaned up and modified ${totalModified} files.`);
