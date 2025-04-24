// TODO: Add specific error translation
// Access error differently based on SafeActionResult structure
const errorMessage =
	result?.serverError || // Use serverError for execution errors
	result?.validationErrors || // Check for validation errors
	// result?.error || // Removed fallback to .error as it doesn't exist on SafeActionResult
	"Failed to remove employee"; // Placeholder text
console.error("Remove Employee Error:", result); // Log the whole result for debugging
// Ensure errorMessage is a string before passing to toast
