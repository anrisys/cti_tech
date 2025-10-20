SELECT 
    u.id AS user_id,
    u.name,
    ROUND(AVG(t.completed_at::date - t.created_at::date)::numeric, 1) AS avg_completion_days,
    COUNT(t.id) AS total_tasks_done
FROM users u
JOIN tasks t ON u.id = t.user_id
WHERE t.status = 'Done'
    AND t.completed_at >= CURRENT_DATE - INTERVAL '30 days'
    AND t.completed_at IS NOT NULL
GROUP BY u.id, u.name
ORDER BY avg_completion_days ASC
LIMIT 5;