async function submitForm() {
  const data = {
    goal: goal.value,
    status: status.value,
    risks: risks.value,
    questions: questions.value,
  };

  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  result.textContent = json.report;
}
