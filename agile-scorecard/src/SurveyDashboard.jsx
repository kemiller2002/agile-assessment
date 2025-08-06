// SurveyDashboard.jsx
import React, { useState, useEffect } from "react";
import surveyList from "./survey-list.json";
import { Card, CardContent } from "./components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/ui/accordion";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
//import { ScrollArea } from "./components/ui/scroll-area";

import { Link } from "react-router-dom";

const categoryColors = {
  "Agile Foundations": "bg-blue-100 text-blue-800",
  "Leadership & Culture": "bg-yellow-100 text-yellow-800",
  "Delivery & Technical Practices": "bg-green-100 text-green-800",
  "Role-Based 360 Feedback": "bg-purple-100 text-purple-800",
};

export function SurveyDashboard() {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Agile Assessment Engine
      </h1>
      <p className="text-center text-gray-600 max-w-xl mx-auto">
        Choose an assessment below to evaluate different dimensions of Agile
        maturity across teams, leadership, and roles.
      </p>

      <Accordion type="multiple" className="w-full">
        {surveyList.map((group, index) => (
          <AccordionItem value={`group-${index}`} key={group.name}>
            <AccordionTrigger className="text-xl font-semibold text-left">
              {group.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {group.assessments.map((assessment) => (
                  <Card
                    key={assessment.filename}
                    className="hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {assessment.title}
                      </h2>
                      <Badge
                        className={`${
                          categoryColors[assessment.group]
                        } px-2 py-0.5 rounded`}
                      >
                        {assessment.group}
                      </Badge>
                      <p className="text-sm text-gray-600 truncate">
                        {assessment.filename}
                      </p>
                      <Link
                        to={`survey/${assessment.filename}`}
                        className="startAssessment"
                      >
                        <Button className="mt-2" variant="outline">
                          Start Assessment
                        </Button>
                      </Link>

                      <Link to={`create-instance/${assessment.filename}`}>
                        <Button className="mt-2" variant="outline">
                          Create Comparative Assessment
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold">
              {selectedAssessment.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              File: {selectedAssessment.filename}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedAssessment(null)}
              >
                Cancel
              </Button>
              <Button variant="default">Continue</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
