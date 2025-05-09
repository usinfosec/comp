import JSZip from "jszip"
import FileSaver from "file-saver"
import { getFrameworks, getRequirements, getControls, getPolicies, getTasks, getTrainingVideos } from "./storage"

export async function exportToZip(): Promise<void> {
  const zip = new JSZip()

  // Get all data from storage
  const frameworks = getFrameworks()
  const requirements = getRequirements()
  const controls = getControls()
  const policies = getPolicies()
  const tasks = getTasks()
  const videos = getTrainingVideos()

  // Add each data type to a separate file in the zip
  zip.file("frameworks.json", JSON.stringify(frameworks, null, 2))
  zip.file("requirements.json", JSON.stringify(requirements, null, 2))
  zip.file("controls.json", JSON.stringify(controls, null, 2))
  zip.file("policies.json", JSON.stringify(policies, null, 2))
  zip.file("tasks.json", JSON.stringify(tasks, null, 2))
  zip.file("videos.json", JSON.stringify(videos, null, 2))

  // Generate the zip file
  const content = await zip.generateAsync({ type: "blob" })

  // Save the zip file
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  FileSaver.saveAs(content, `compliance-data-${timestamp}.zip`)
}
