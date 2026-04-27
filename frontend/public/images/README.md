# Background Images

## Adding the Farm Background Image

1. Save your farm background image as `farm-bg.jpg` in this directory
2. The image will automatically be used as the background

## Recommended Image Specifications

- **Format**: JPG or WebP (for better compression)
- **Dimensions**: 1920x1080 or higher
- **File size**: < 500KB (optimize for web)
- **Style**: Warm sunset/sunrise farm scene with fields

## Current Setup

The app currently uses an SVG pattern as a placeholder. Once you add `farm-bg.jpg`, update the CSS in `src/index.css`:

```css
body::before {
  background: 
    linear-gradient(135deg, rgba(26, 20, 16, 0.85) 0%, rgba(42, 35, 28, 0.75) 100%),
    url('/images/farm-bg.jpg');  /* Add this line */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

## Image Optimization Tips

- Use tools like TinyJPG or Squoosh to compress
- Aim for warm, golden hour lighting
- Ensure good contrast for text readability
- Consider using WebP format for better compression
