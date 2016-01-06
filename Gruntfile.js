module.exports = function(grunt) {
	// 项目配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			srcPath: 'src/',
			srcCSSPath: 'src/css/',
			destPath: 'dist/',
			jsFileName: 'pricecalculator',
		},
		concat:{
			css:{
				src:[
					'<%= meta.srcCSSPath %>reset.css',
					'<%= meta.srcCSSPath %>common.css',
					'<%= meta.srcCSSPath %>pricecalculator.css'
				],
				dest: '<%= meta.destPath %>css/pricecalculator.css'
			}
		},
		cssmin: {
            options: {
                banner: '', // set to empty; see bellow
                keepSpecialComments: '*', // set to '*' because we already add the banner in sass
                sourceMap: false
            },
            mui: {
                src: '<%= meta.destPath %>css/pricecalculator.css',
                dest: '<%= meta.destPath %>css/pricecalculator.min.css'
            }
        },
		copy: {
			html: {
				expand: true,
				cwd: '<%= meta.srcPath %>',
				src: '*.html',
				dest: '<%= meta.destPath %>/'
			},
			js:{
				expand: true,
				cwd: '<%= meta.srcPath %>',
				src: 'js/*',
				dest: '<%= meta.destPath %>/'
			},
			assets:{
				expand: true,
				cwd: '<%= meta.srcPath %>',
				src: 'assets/**/*',
				dest: '<%= meta.destPath %>/'
			}
		},
		uglify: {
			build: {
				src: '<%= meta.srcPath %>js/<%= meta.jsFileName %>.js',
				dest: '<%= meta.destPath %>js/<%= meta.jsFileName %>.min.js'
			}
		},
		usemin: {
            html: ['<%= meta.destPath %>/*.html'],   // 注意此处是build/
            options: {
                assetsDirs: ['<%= meta.srcPath %>/css','<%= meta.srcPath %>/js']
            }
        }
	});
	// 加载提供"uglify"任务的插件
	require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// 默认任务
	grunt.registerTask('default', ['concat','cssmin','copy','uglify','usemin']);
}
