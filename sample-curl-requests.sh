#!/bin/bash

# Sample CURL requests for Me-API Playground

echo "=== Me-API Playground - Sample CURL Requests ==="
echo ""

echo "1. Health Check"
echo "   Command:"
echo "   curl http://localhost:3001/health"
echo ""

echo "2. Get Profile"
echo "   Command:"
echo "   curl http://localhost:3001/api/profile"
echo ""

echo "3. Get Full Profile with all data"
echo "   Command:"
echo "   curl http://localhost:3001/api/profile/1/full"
echo ""

echo "4. Get All Projects"
echo "   Command:"
echo "   curl http://localhost:3001/api/projects"
echo ""

echo "5. Get Projects by Skill"
echo "   Command:"
echo "   curl 'http://localhost:3001/api/projects?skill=React'"
echo ""

echo "6. Get Top Skills"
echo "   Command:"
echo "   curl 'http://localhost:3001/api/skills/top?limit=5'"
echo ""

echo "7. Search"
echo "   Command:"
echo "   curl 'http://localhost:3001/api/search?q=python'"
echo ""

echo "8. Create Profile"
echo "   Command:"
echo "   curl -X POST http://localhost:3001/api/profile \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"name\": \"Jane Doe\","
echo "       \"email\": \"jane@example.com\","
echo "       \"education\": \"Bachelor of Science\""
echo "     }'"
echo ""

echo "9. Create Project"
echo "   Command:"
echo "   curl -X POST http://localhost:3001/api/projects \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"profile_id\": 1,"
echo "       \"title\": \"My New Project\","
echo "       \"description\": \"Description here\","
echo "       \"skills\": [\"React\", \"Node.js\"]"
echo "     }'"
echo ""

echo "10. Add Skill"
echo "    Command:"
echo "    curl -X POST http://localhost:3001/api/skills \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{"
echo "        \"profile_id\": 1,"
echo "        \"skill_name\": \"Docker\","
echo "        \"proficiency\": \"Intermediate\""
echo "      }'"
