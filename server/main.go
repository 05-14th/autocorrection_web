package main

import (
	"log"
	"regexp"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/trustmaster/gospell"
)

// Initialize spell checker
var spellChecker *gospell.Checker

func initSpellChecker() {
	var err error
	spellChecker, err = gospell.New("en")
	if err != nil {
		log.Fatalf("Failed to load spell checker: %v", err)
	}
}

func correctSpelling(text string) string {
	words := strings.Fields(text)
	for i, word := range words {
		if !spellChecker.IsCorrect(word) {
			corrections := spellChecker.Suggest(word)
			if len(corrections) > 0 {
				words[i] = corrections[0] // Pick the first suggestion
			}
		}
	}
	return strings.Join(words, " ")
}

func restorePunctuation(text string) string {
	re := regexp.MustCompile(`\s+([.,!?;:])`)
	return re.ReplaceAllString(text, "$1")
}

func correctGrammar(text string) string {
	// Placeholder: Ideally, integrate with an AI model like OpenAI or use NLP library
	return text // For now, returning the same text
}

func correctTextHandler(c *fiber.Ctx) error {
	var request struct {
		Text string `json:"text"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if request.Text == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Text is required"})
	}

	text := correctSpelling(request.Text)
	text = restorePunctuation(text)
	text = correctGrammar(text)

	return c.JSON(fiber.Map{"corrected": text})
}

func main() {
	app := fiber.New()
	app.Use(cors.New())

	initSpellChecker()

	app.Post("/correct_grammar", correctTextHandler)

	log.Println("Server running on http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
